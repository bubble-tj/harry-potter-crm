"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, FieldError, Input, Label, Select, Textarea } from "@/components/ui";
import { updateContractAction, type ContractActionState } from "@/lib/actions/contracts";

type ClientOption = { id: string; name: string };

type ContractValues = {
  id: string;
  clientId: string;
  title: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELED";
  startDate?: Date | null;
  dueDate?: Date | null;
  notes?: string | null;
};

function dateInputValue(d?: Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function ContractEditForm({
  contract,
  clients,
}: {
  contract: ContractValues;
  clients: ClientOption[];
}) {
  const action = updateContractAction.bind(null, contract.id);
  const [state, formAction, pending] = useActionState<ContractActionState, FormData>(action, undefined);

  return (
    <form action={formAction} className="space-y-4 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select id="clientId" name="clientId" defaultValue={contract.clientId} required>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select id="status" name="status" defaultValue={contract.status}>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={contract.title} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start date</Label>
          <Input id="startDate" name="startDate" type="date" defaultValue={dateInputValue(contract.startDate)} />
        </div>
        <div>
          <Label htmlFor="dueDate">Due date</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={dateInputValue(contract.dueDate)} />
        </div>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={4} defaultValue={contract.notes ?? ""} />
      </div>
      <FieldError message={state?.error} />
      <div className="flex items-center gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
        <Link href={`/contracts/${contract.id}`} className="text-sm text-stone-600 hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
