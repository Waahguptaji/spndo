import ListItem from "@/components/ui/ListItem";

interface RemindersListProps {
  onAddReminderClick: () => void;
}

export default function RemindersList({ onAddReminderClick }: RemindersListProps) {
  const reminders = [
    { topic: "Pay Electricity Bill", description: "Due soon", rightLabel: "Aug 20, 2025" },
    { topic: "Doctor Appointment", description: "Health Checkup", rightLabel: "Aug 22, 2025" }
  ];

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={onAddReminderClick}
          className="bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-dark"
        >
          + Set Reminder
        </button>
      </div>

      <div className="space-y-4 ">
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
    </div>
  );
}
