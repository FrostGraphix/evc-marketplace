import { OrderRecord } from '@/types';
import { CFG } from './products';
import { money } from './utils';

// Helper to format date
function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Recently placed';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

// Common EVC Brand Header HTML
function getEmailHeader(title: string, subtitle: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #03090a 0%, #0a1628 100%); border-radius: 18px 18px 0 0; padding: 36px 30px; text-align: center; border-bottom: 2px solid #f26522;">
      <tr>
        <td align="center">
          <div style="display: inline-block; background: #f26522; color: #ffffff; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; font-weight: 900; font-size: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin-bottom: 12px; box-shadow: 0 4px 16px rgba(242, 101, 34, 0.45); letter-spacing: -0.02em;">
            EVC
          </div>
          <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.02em;">
            EVC <span style="color: #f26522;">Nigeria</span>
          </h1>
          <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600;">
            Powering Smart Living & Infrastructure • Ilorin • Ibadan • Abuja
          </p>
          <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(242, 101, 34, 0.25);">
            <div style="display: inline-block; background: rgba(242, 101, 34, 0.2); border: 1px solid #f26522; border-radius: 999px; padding: 6px 18px; color: #ffffff; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              ${title}
            </div>
            <p style="margin: 10px 0 0 0; color: #cbd5e1; font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
              ${subtitle}
            </p>
          </div>
        </td>
      </tr>
    </table>
  `;
}

// Common EVC Brand Footer HTML
function getEmailFooter(): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #03090a; border-radius: 0 0 18px 18px; padding: 28px 24px; text-align: center; color: #94a3b8; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid rgba(242, 101, 34, 0.2);">
      <tr>
        <td align="center">
          <p style="margin: 0 0 8px 0; color: #f8fafc; font-weight: 700; font-size: 13px;">
            EVC Nigeria (evcng.com) — Engineering & Connected Living
          </p>
          <p style="margin: 0 0 12px 0; color: #94a3b8; line-height: 1.6;">
            <strong>Ilorin Hub:</strong> Kajo Mall, Fate / Flower Garden GRA • <strong>Ibadan:</strong> Bodija Experience Hub<br/>
            <strong>Abuja:</strong> Corporate FCT • WhatsApp Concierge: <a href="https://wa.me/${CFG.phone}" style="color: #25d366; text-decoration: none; font-weight: 700;">${CFG.phoneDisp}</a>
          </p>
          <div style="padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #64748b;">
            © ${new Date().getFullYear()} EVC Nigeria Technology Ltd. All rights reserved.
          </div>
        </td>
      </tr>
    </table>
  `;
}

/**
 * 1. Generate Order Confirmation Email (Customer Receipt)
 */
export function generateOrderConfirmationEmail(order: OrderRecord): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 14px 10px; font-size: 14px; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <strong style="color: #03090a; display: block; font-size: 14px;">${item.name}</strong>
          <span style="display: inline-block; font-size: 12px; color: #ea580c; background: #fff7ed; border-radius: 6px; padding: 2px 8px; margin-top: 4px; font-weight: 600;">
            ${item.opt} • ${item.color}
          </span>
        </td>
        <td style="padding: 14px 10px; text-align: center; font-size: 14px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${item.qty}
        </td>
        <td style="padding: 14px 10px; text-align: right; font-size: 14px; color: #334155; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${money(item.price)}
        </td>
        <td style="padding: 14px 10px; text-align: right; font-size: 14px; font-weight: 700; color: #f26522; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          ${money(item.price * item.qty)}
        </td>
      </tr>
    `
    )
    .join('');

  const isBankTransfer = order.paymentMethod === 'transfer';
  const paymentNotice = isBankTransfer
    ? `
      <div style="background: #fffbeb; border: 1px solid #fef3c7; border-left: 4px solid #f59e0b; border-radius: 12px; padding: 18px; margin: 24px 0;">
        <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 700;">
          ⚠️ Bank Transfer Instructions
        </h4>
        <p style="margin: 0 0 10px 0; color: #78350f; font-size: 13px; line-height: 1.5;">
          Please transfer the exact total of <strong>${money(order.total)}</strong> using your Order ID <strong>${order.id}</strong> as payment narration:
        </p>
        <table role="presentation" width="100%" cellpadding="6" cellspacing="0" style="background: #ffffff; border-radius: 8px; border: 1px solid #fde68a; font-size: 13px; color: #451a03;">
          <tr><td><strong>Bank:</strong></td><td>${CFG.bank.name}</td></tr>
          <tr><td><strong>Account Number:</strong></td><td><strong style="color: #f26522; font-size: 15px;">${CFG.bank.accountNumber}</strong></td></tr>
          <tr><td><strong>Account Name:</strong></td><td>${CFG.bank.accountName}</td></tr>
          <tr><td><strong>Reference:</strong></td><td>${order.id}</td></tr>
        </table>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #92400e;">
          After making the transfer, please send proof of payment to our WhatsApp concierge at <a href="https://wa.me/${CFG.phone}?text=Hello+EVC+Nigeria,+here+is+my+payment+proof+for+order+${order.id}" style="color: #25d366; font-weight: 700; text-decoration: underline;">${CFG.phoneDisp}</a>.
        </p>
      </div>
    `
    : `
      <div style="background: #ecfdf5; border: 1px solid #d1fae5; border-left: 4px solid #10b981; border-radius: 12px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #065f46; font-size: 13px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 600;">
          ✓ Payment Method: ${order.payLabel} • Status: ${order.paymentStatus === 'paid' ? 'Payment Verified & Confirmed' : 'Pending fulfillment'}
        </p>
      </div>
    `;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>EVC Nigeria Order Confirmation #${order.id}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 18px; box-shadow: 0 12px 36px rgba(10, 22, 40, 0.12); overflow: hidden;">
        <tr>
          <td>
            ${getEmailHeader(`Order Confirmation #${order.id}`, `Hello ${order.name}, thank you for choosing EVC Nigeria.`)}
            
            <div style="padding: 28px 24px;">
              <!-- Intro -->
              <p style="margin: 0 0 20px 0; font-size: 15px; color: #334155; line-height: 1.6;">
                We have received your procurement order and are currently preparing your consignment. Below is your itemized transaction summary and logistics details.
              </p>

              <!-- Meta Summary Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; padding: 14px 18px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #ea580c; font-weight: 700; letter-spacing: 0.05em; display: block;">Order Reference</span>
                    <strong style="font-size: 15px; color: #03090a;">#${order.id}</strong>
                  </td>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #ea580c; font-weight: 700; letter-spacing: 0.05em; display: block;">Placed On</span>
                    <span style="font-size: 13px; color: #334155;">${formatDate(order.createdAt)}</span>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #ea580c; font-weight: 700; letter-spacing: 0.05em; display: block;">Logistics Method</span>
                    <strong style="font-size: 13px; color: #03090a;">${order.deliveryLabel}</strong>
                    <span style="display: block; font-size: 12px; color: #f26522;">(ETA: ${order.eta})</span>
                  </td>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #ea580c; font-weight: 700; letter-spacing: 0.05em; display: block;">Order Status</span>
                    <span style="display: inline-block; background: #ffedd5; color: #c2410c; font-size: 12px; font-weight: 700; padding: 3px 10px; border-radius: 999px; text-transform: capitalize;">
                      ${order.orderStatus || 'received'}
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Payment Notice -->
              ${paymentNotice}

              <!-- Items Table -->
              <h3 style="margin: 24px 0 12px 0; font-size: 16px; color: #03090a; font-weight: 700; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                Procurement Items
              </h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
                <thead>
                  <tr style="background: #f1f5f9; color: #0f172a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">
                    <th align="left" style="padding: 10px; border-radius: 8px 0 0 8px;">Item Description</th>
                    <th align="center" style="padding: 10px;">Qty</th>
                    <th align="right" style="padding: 10px;">Unit Price</th>
                    <th align="right" style="padding: 10px; border-radius: 0 8px 8px 0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Financial Totals Table -->
              <table role="presentation" width="100%" cellpadding="4" cellspacing="0" style="font-size: 14px; margin-bottom: 24px;">
                <tr>
                  <td align="right" style="color: #64748b;">Subtotal:</td>
                  <td align="right" width="140" style="color: #03090a; font-weight: 600;">${money(order.subtotal)}</td>
                </tr>
                <tr>
                  <td align="right" style="color: #64748b;">Delivery / Freight (${order.deliveryLabel}):</td>
                  <td align="right" style="color: #03090a; font-weight: 600;">${order.fee > 0 ? money(order.fee) : 'FREE'}</td>
                </tr>
                ${
                  order.discount > 0
                    ? `
                  <tr>
                    <td align="right" style="color: #10b981;">Discount Applied:</td>
                    <td align="right" style="color: #10b981; font-weight: 600;">-${money(order.discount)}</td>
                  </tr>
                `
                    : ''
                }
                <tr style="border-top: 2px solid #e2e8f0;">
                  <td align="right" style="padding-top: 10px; font-size: 17px; font-weight: 800; color: #03090a;">Grand Total:</td>
                  <td align="right" style="padding-top: 10px; font-size: 18px; font-weight: 800; color: #f26522;">${money(order.total)}</td>
                </tr>
              </table>

              <!-- Customer & Delivery Dossier -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin-bottom: 24px;">
                <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #0a1628; text-transform: uppercase; letter-spacing: 0.05em;">
                  Delivery Dossier
                </h4>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #03090a;"><strong>Recipient:</strong> ${order.name}</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #03090a;"><strong>Phone:</strong> ${order.phone}</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #03090a;"><strong>Email:</strong> ${order.email}</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #03090a;"><strong>Address:</strong> ${order.address}</p>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #03090a;"><strong>State:</strong> ${order.state}</p>
                ${order.landmark ? `<p style="margin: 0 0 4px 0; font-size: 14px; color: #ea580c;"><strong>Landmark:</strong> ${order.landmark}</p>` : ''}
                ${order.note ? `<p style="margin: 8px 0 0 0; font-size: 13px; color: #64748b; font-style: italic;"><strong>Note:</strong> "${order.note}"</p>` : ''}
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0 16px 0;">
                <a href="https://wa.me/${CFG.phone}?text=Hello+EVC+Nigeria,+I+am+checking+on+my+order+${order.id}" style="display: inline-block; background: #25d366; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
                  💬 Message EVC Concierge on WhatsApp
                </a>
              </div>
            </div>

            ${getEmailFooter()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * 2. Generate Admin Alert Email (Store Staff Notification)
 */
export function generateAdminAlertEmail(order: OrderRecord): string {
  const itemsText = order.items
    .map((it) => `• [x] ${it.qty}x ${it.name} (${it.opt}, ${it.color}) — ${money(it.price * it.qty)}`)
    .join('<br/>');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>🚨 EVC Operations Alert: New Order #${order.id}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #03090a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 18px; box-shadow: 0 14px 40px rgba(0,0,0,0.5); overflow: hidden;">
        <tr>
          <td>
            ${getEmailHeader(`OPERATIONS ALERT • ORDER #${order.id}`, `New Customer Procurement: ${money(order.total)} from ${order.name} (${order.state})`)}

            <div style="padding: 28px 24px;">
              <!-- Urgent Badge -->
              <div style="background: #fff7ed; border: 1px solid #fed7aa; border-left: 4px solid #f26522; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 6px 0; color: #9a3412; font-size: 16px;">
                  ⚡ Action Required: Dispatch & Warehouse Prep #${order.id}
                </h3>
                <p style="margin: 0; color: #7c2d12; font-size: 13px; line-height: 1.5;">
                  A new high-value order has been received on EVC Marketplace. Review payment confirmation, reserve inventory stock, and assign to regional delivery team.
                </p>
              </div>

              <!-- Customer Contact Matrix -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px; padding: 18px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #f26522; font-weight: 700;">Customer Name</span>
                    <strong style="font-size: 15px; color: #03090a; display: block;">${order.name}</strong>
                  </td>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #f26522; font-weight: 700;">Phone Number</span>
                    <strong style="font-size: 15px; color: #03090a; display: block;">
                      <a href="tel:${order.phone}" style="color: #f26522; text-decoration: none;">${order.phone}</a>
                    </strong>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #f26522; font-weight: 700;">Destination State</span>
                    <strong style="font-size: 14px; color: #03090a; display: block;">${order.state}</strong>
                  </td>
                  <td width="50%" style="vertical-align: top; padding: 6px;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #f26522; font-weight: 700;">Payment & Status</span>
                    <span style="display: block; font-size: 13px; font-weight: 700; color: ${order.paymentStatus === 'paid' ? '#059669' : '#d97706'};">
                      ${order.payLabel} (${order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING'})
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 6px; border-top: 1px solid #e2e8f0;">
                    <span style="font-size: 11px; text-transform: uppercase; color: #f26522; font-weight: 700;">Delivery Address & Landmark</span>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #334155;">
                      ${order.address} ${order.landmark ? `<br/><span style="color: #f26522; font-weight: 600;">Landmark: ${order.landmark}</span>` : ''}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Warehouse Packing Checklist -->
              <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #0a1628; text-transform: uppercase; letter-spacing: 0.05em;">
                Consignment Checklist:
              </h4>
              <div style="background: #ffffff; border: 1px solid #fed7aa; border-radius: 10px; padding: 14px; font-size: 14px; color: #03090a; line-height: 1.8; margin-bottom: 24px;">
                ${itemsText}
              </div>

              <!-- Quick WhatsApp Contact Button for Admin -->
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://wa.me/${order.phone.replace(/^0/, '234').replace(/[^0-9]/g, '')}?text=Hello+${encodeURIComponent(order.name)},+we+received+your+EVC+Nigeria+order+${order.id}+and+are+preparing+your+items." style="display: inline-block; background: #25d366; color: #ffffff; text-decoration: none; padding: 13px 28px; border-radius: 10px; font-weight: 700; font-size: 14px;">
                  💬 Contact Customer via WhatsApp
                </a>
              </div>
            </div>

            ${getEmailFooter()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * 3. Generate Dispatch Email (Customer Delivery Notice)
 */
export function generateDispatchEmail(
  order: OrderRecord,
  trackingInfo?: string
): string {
  const isHubOrder =
    order.state.toLowerCase().includes('kwara') ||
    order.state.toLowerCase().includes('oyo') ||
    order.state.toLowerCase().includes('abuja');

  const trackingNotice = trackingInfo
    ? trackingInfo
    : isHubOrder
    ? 'Handed to EVC Regional Logistics Courier for direct delivery. The rider will contact you prior to arriving at your landmark.'
    : 'Consignment handed to our priority nationwide logistics partner (GIG Logistics / FedEx / Red Star Express). Transit ETA: ' + order.eta + '.';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Your EVC Nigeria Order #${order.id} has been dispatched!</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 18px; box-shadow: 0 12px 36px rgba(10, 22, 40, 0.12); overflow: hidden;">
        <tr>
          <td>
            ${getEmailHeader(`Order #${order.id} Dispatched!`, `Good news, ${order.name}! Your package has left our logistics hub.`)}

            <div style="padding: 28px 24px;">
              <!-- Dispatch Status Banner -->
              <div style="background: #fff7ed; border: 1px solid #fed7aa; border-left: 4px solid #f26522; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 6px 0; color: #9a3412; font-size: 17px;">
                  🚚 Consignment In Transit
                </h3>
                <p style="margin: 0 0 10px 0; color: #7c2d12; font-size: 14px; line-height: 1.5;">
                  ${trackingNotice}
                </p>
                <div style="background: #ffffff; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #03090a; border: 1px solid #e2e8f0;">
                  <strong>Estimated Delivery:</strong> ${order.eta}
                </div>
              </div>

              <!-- Shipping Destination Review -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <span style="font-size: 11px; text-transform: uppercase; color: #f26522; font-weight: 700; display: block; margin-bottom: 6px;">
                  Delivery Address:
                </span>
                <p style="margin: 0; font-size: 14px; color: #03090a; line-height: 1.5;">
                  <strong>${order.name}</strong> (${order.phone})<br/>
                  ${order.address}, ${order.state}
                  ${order.landmark ? `<br/><span style="color: #f26522; font-weight: 600;">Landmark: ${order.landmark}</span>` : ''}
                </p>
              </div>

              <!-- Items in this package -->
              <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #0a1628; text-transform: uppercase; letter-spacing: 0.05em;">
                Consignment Items (${order.items.length}):
              </h4>
              <ul style="margin: 0 0 24px 0; padding-left: 20px; font-size: 14px; color: #334155; line-height: 1.8;">
                ${order.items.map((it) => `<li><strong>${it.qty}x</strong> ${it.name} (${it.opt})</li>`).join('')}
              </ul>

              <!-- Important Delivery Tip -->
              <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; padding: 14px; font-size: 13px; color: #065f46; margin-bottom: 28px;">
                💡 <strong>Delivery Tip:</strong> Please ensure your phone (${order.phone}) is active and reachable so our driver/logistics officer can coordinate drop-off at your destination.
              </div>

              <!-- WhatsApp Support Button -->
              <div style="text-align: center; margin: 24px 0;">
                <a href="https://wa.me/${CFG.phone}?text=Hello+EVC+Nigeria,+I+have+a+question+regarding+dispatch+of+order+${order.id}" style="display: inline-block; background: #25d366; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
                  💬 Contact Logistics Care on WhatsApp
                </a>
              </div>
            </div>

            ${getEmailFooter()}
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
