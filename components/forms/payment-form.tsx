"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button, FieldError, Input, Label } from "@/components/ui";
import { createPaymentAction, type PaymentActionState } from "@/lib/actions/payments";

export function PaymentForm({
  contractId,
  suggestedAmountCents,
}: {
  contractId: string;
  suggestedAmountCents: number;
}) {
  const action = createPaymentAction.bind(null, contractId);
  const [state, formAction, pending] = useActionState<PaymentActionState, FormData>(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  const today = new Date().toISOString().slice(0, 10);
  const suggested = (suggestedAmountCents / 100).toFixed(2);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div>
        <Label htmlFor="amount">Amount (USD)</Label>
        <Input id="amount" name="amount" inputMode="decimal" defaultValue={suggested} required />
      </div>
      <div>
        <Label htmlFor="paidAt">Date</Label>
        <Input id="paidAt" name="paidAt" type="date" defaultValue={today} required />
      </div>
      <div>
        <Label htmlFor="method">Method</Label>
        <Input id="method" name="method" placeholder="Gold, cash, barter…" />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" name="notes" />
      </div>
      <FieldError message={state?.error} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving…" : "Record payment"}
      </Button>
    </form>
  );
}
