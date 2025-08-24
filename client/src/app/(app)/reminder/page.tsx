"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ListItem from "@/components/ui/ListItem";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SetReminder from "@/components/reminder/setReminder"; 
import MobileView from "@/hooks/mobileView"; // custom hook from step 1

interface RemindersListProps {}

export default function RemindersList({}: RemindersListProps) {
  const router = useRouter();
  const isMobile = MobileView();
  const [openModal, setOpenModal] = useState(false);

  const reminders = [
    { topic: "Pay Electricity Bill", description: "Due soon", rightLabel: "Aug 20, 2025" },
    { topic: "Doctor Appointment", description: "Health Checkup", rightLabel: "Aug 22, 2025" }
  ];

  const handleAddClick = () => {
    if (isMobile) {
      router.push("/reminder/add"); // separate page on mobile
    } else {
      setOpenModal(true); // modal on desktop
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="primary" onClick={handleAddClick}>
          + Set Reminder
        </Button>
      </div>

      <div className="space-y-4">
        {reminders.map((reminder, index) => (
          <ListItem
            key={index}
            variant="reminder"
            title={reminder.topic}
            description={reminder.description}
            rightLabel={reminder.rightLabel}
          />
        ))}
      </div>

      {/* Modal only for desktop */}
      {!isMobile && (
        <Modal open={openModal} onClose={() => setOpenModal(false)} title="Add Reminder" className="p-7">
          <SetReminder />
        </Modal>
      )}
    </div>
  );
}
