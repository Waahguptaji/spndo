"use client";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useRouter } from "next/navigation";
import React from "react";

function AddExpensePage() {
  const router = useRouter();

  return (
    <TransactionForm
      kind="expense"
      onSuccess={() => {
        router.push("/transactions");
      }}
    />
  );
}

export default AddExpensePage;
