import SetReminder from "@/components/reminder/setReminder";
import React from "react";
import AddGoalPage from "../../goals/add/page";

type Props = {};

const AddReminderPage = (props: Props) => {
  return (
     <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Add Reminder</h1>
      <SetReminder />
    </div>
  );
};

export default AddReminderPage;
