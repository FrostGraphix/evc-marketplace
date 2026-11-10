import { redirect } from 'next/navigation';

export default async function TrackByIdPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ email?: string; phone?: string }>;
}) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : {};
  const query = new URLSearchParams();
  if (id) query.set('id', id);
  if (sp.email) query.set('email', sp.email);
  if (sp.phone) query.set('phone', sp.phone);

  redirect(`/track?${query.toString()}`);
}