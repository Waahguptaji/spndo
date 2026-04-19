"use client";

import SetReminder from "@/components/reminder/setReminder";
import React from "react";
import { useRouter } from "next/navigation";

const AddReminderPage = () => {
  const router = useRouter();

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add Reminder</h1>
      <SetReminder
        onSuccess={() => {
          router.push("/reminder");
        }}
      />
    </div>
  );
};

export default AddReminderPage;
