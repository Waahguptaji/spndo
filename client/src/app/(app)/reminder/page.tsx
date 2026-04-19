"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ListItem from "@/components/ui/ListItem";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import SetReminder from "@/components/reminder/setReminder";
import MobileView from "@/hooks/mobileView"; // custom hook from step 1
import {
  deleteReminder,
  getReminders,
  Reminder,
  toggleReminder,
} from "@/lib/api/reminders";

export default function RemindersList() {
  const router = useRouter();
  const isMobile = MobileView();
  const [openModal, setOpenModal] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllReminders = async () => {
    try {
      setError(null);
      const res = await getReminders();
      setReminders(res.reminders ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch reminders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReminders();
  }, []);

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

      {loading ? (
        <div className="space-y-3 mb-4">
          <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
          <div className="h-20 rounded-xl bg-neutral-softGrey2/70 dark:bg-neutral-grey1/50 animate-pulse" />
        </div>
      ) : null}
      {error ? <p className="text-system-red mb-4">{error}</p> : null}

      <div className="space-y-4">
        {!loading && reminders.length === 0 ? (
          <p className="text-neutral-grey2 dark:text-neutral-grey3">
            No reminders yet.
          </p>
        ) : (
          reminders.map((reminder) => (
            <div key={reminder.id} className="space-y-2">
              <ListItem
                variant="reminder"
                title={reminder.title}
                description={reminder.note ?? "No note"}
                rightLabel={new Date(reminder.due_at).toLocaleDateString(
                  "en-IN",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
                status=""
                icon1={null}
                icon2={null}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={async () => {
                    await toggleReminder(reminder.id);
                    await fetchAllReminders();
                  }}
                >
                  {reminder.is_done ? "Mark Pending" : "Mark Done"}
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await deleteReminder(reminder.id);
                    await fetchAllReminders();
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal only for desktop */}
      {!isMobile && (
        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Add Reminder"
          className="p-7"
        >
          <SetReminder
            onSuccess={async () => {
              setOpenModal(false);
              await fetchAllReminders();
            }}
          />
        </Modal>
      )}
    </div>
  );
}
