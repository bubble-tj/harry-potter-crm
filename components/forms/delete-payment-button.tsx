"use client";

import { useParams } from "next/navigation";
import { deletePaymentAction } from "@/lib/actions/payments";

export function DeletePaymentButton({ paymentId }: { paymentId: string }) {
  const params = useParams<{ id: string }>();
  const contractId = params.id;
  const action = deletePaymentAction.bind(null, paymentId, contractId);
  return (
    <form action={action}>
      <button
        type="submit"
        className="text-xs text-stone-500 hover:text-red-600"
        aria-label="Delete payment"
      >
        Delete
      </button>
    </form>
  );
}
