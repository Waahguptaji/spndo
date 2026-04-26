"use client";
import AddGoalForm from "@/components/goal/AddGoalForm";
import React from "react";
import { useRouter } from "next/navigation";

const AddGoalPage = () => {
  const router = useRouter();

  return (
    <div className="p-8">
      <AddGoalForm
        onSuccess={() => {
          router.push("/goals");
        }}
      />
    </div>
  );
};

export default AddGoalPage;
