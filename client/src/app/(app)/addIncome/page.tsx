import TransactionForm from "@/components/transactions/TransactionForm";
import React from "react";

type Props = {};

function page({}: Props) {
  return (
    <div>
      <TransactionForm kind="income" />
    </div>
  );
}

export default page;
