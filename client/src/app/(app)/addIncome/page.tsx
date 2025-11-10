import TransactionForm from "@/components/transactions/TransactionForm";
import React from "react";

function page() {
  return (
    <div>
      <TransactionForm kind="income" />
    </div>
  );
}

export default page;
