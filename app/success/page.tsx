// app/success/page.tsx
import { notFound } from "next/navigation";
import { SuccessState } from "@/features/checkout/SuccessState";

export const dynamic = "force-dynamic";  // evita cache involuntário em dev
export const revalidate = 0;             // revalidação desabilitada

export default function Page({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = searchParams?.id?.toString();
  if (!id) return notFound();
  return <SuccessState orderId={id} />;
}