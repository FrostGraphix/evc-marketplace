export function flyToCart(fromElement: HTMLElement | null, imageSrc?: string) {
  if (typeof window === 'undefined' || !fromElement) return;

  const cartTarget = document.getElementById('headerCartBtn') || document.querySelector('[aria-label="Shopping cart"]');
  if (!cartTarget) return;

  const a = fromElement.getBoundingClientRect();
  const b = cartTarget.getBoundingClientRect();

  const flyer = document.createElement('div');
  flyer.className = 'fly-particle';

  const size = Math.min(a.width || 100, 120);
  Object.assign(flyer.style, {
    left: `${a.left + (a.width - size) / 2}px`,
    top: `${a.top + (a.height - size) / 2}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '18px',
    overflow: 'hidden',
    position: 'fixed',
    zIndex: '99999',
    pointerEvents: 'none',
    border: '1px solid rgba(255, 122, 51, 0.3)',
    boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4)',
  });

  if (imageSrc) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    flyer.appendChild(img);
  } else {
    flyer.style.background = 'linear-gradient(135deg, #f26522, #ff7a33)';
  }

  document.body.appendChild(flyer);

  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);

  const animation = flyer.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      {
        transform: `translate(${dx * 0.45}px, ${Math.min(-60, dy * 0.45 - 60)}px) scale(0.65)`,
        opacity: 0.95,
        offset: 0.45,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.12)`,
        opacity: 0.15,
      },
    ],
    {
      duration: 750,
      easing: 'cubic-bezier(0.5, 0, 0.2, 1)',
    }
  );

  animation.onfinish = () => {
    flyer.remove();
    const badge = cartTarget.querySelector('.cart-badge');
    if (badge) {
      badge.classList.remove('animate-bump');
      void (badge as HTMLElement).offsetWidth;
      badge.classList.add('animate-bump');
    }
  };
}

export function initMagneticButtons() {
  if (typeof window === 'undefined') return () => {};

  const handlePointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    const target = (e.target as HTMLElement)?.closest?.('.mag') as HTMLElement | null;

    document.querySelectorAll<HTMLElement>('.mag.pulled').forEach((el) => {
      if (el !== target) {
        el.style.transform = '';
        el.classList.remove('pulled');
      }
    });

    if (!target) return;
    const rect = target.getBoundingClientRect();
    target.classList.add('pulled');
    const x = (e.clientX - rect.left - rect.width / 2) * 0.16;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.24;
    target.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handlePointerLeave = () => {
    document.querySelectorAll<HTMLElement>('.mag.pulled').forEach((el) => {
      el.style.transform = '';
      el.classList.remove('pulled');
    });
  };

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', handlePointerLeave);

  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerleave', handlePointerLeave);
  };
}

export function initSmoothScroll() {
  if (typeof window === 'undefined') return () => {};
  return () => {};
}

export function observeReveals() {
  if (typeof window === 'undefined') return;
  const elements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -50px 0px' }
  );
  elements.forEach((el) => observer.observe(el));
}
