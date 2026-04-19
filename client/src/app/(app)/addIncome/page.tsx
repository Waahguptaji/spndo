"use client";

import TransactionForm from "@/components/transactions/TransactionForm";
import { useRouter } from "next/navigation";
import React from "react";

function AddIncomePage() {
  const router = useRouter();

  return (
    <div>
      <TransactionForm
        kind="income"
        onSuccess={() => {
          router.push("/transactions");
        }}
      />
    </div>
  );
}

export default AddIncomePage;
