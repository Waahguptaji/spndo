"use client";
import TransactionForm from "@/components/transactions/TransactionForm";
import Modal from "@/components/ui/Modal";
import React from "react";

type Props = {};

function page({}: Props) {
  return <TransactionForm kind="expense" />;
}

export default page;
