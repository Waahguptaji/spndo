"use client";
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import Calendar from "../ui/calendar";
import Modal from "../ui/Modal";
import { createReminder, ReminderRepeat } from "@/lib/api/reminders";

const contributionOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "none", label: "No repeat" },
];

function formatAmountInput(v: string) {
  const digits = v.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-IN");
}

type SetReminderProps = {
  onSuccess?: () => void | Promise<void>;
};

const SetReminder = ({ onSuccess }: SetReminderProps) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [contribution, setContribution] = useState<string | null>("none");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [openCal, setOpenCal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const contributionLabel =
    contributionOptions.find((o) => o.value === contribution)?.label ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !deadline || !contribution) {
      setErrorMessage("Please fill title, frequency, and deadline.");
      return;
    }

    const repeatMap: Record<string, ReminderRepeat> = {
      none: "NONE",
      daily: "DAILY",
      weekly: "WEEKLY",
      monthly: "MONTHLY",
    };

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await createReminder({
        title: title.trim(),
        note: amount ? `Amount: ₹${amount}` : undefined,
        due_at: deadline.toISOString(),
        repeat: repeatMap[contribution] ?? "NONE",
      });

      setTitle("");
      setAmount("");
      setContribution("none");
      setDeadline(null);
      await onSuccess?.();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create reminder.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-6">
        <FormInput
          label="Reminder Title"
          placeholder="Enter your reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormInput
          label="Amount"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(formatAmountInput(e.target.value))}
          inputMode="numeric"
          suffixText="₹"
        />

        <FormInput
          label="Frequency"
          placeholder="Select"
          value={contributionLabel}
          readOnly
          hasDropdown
          dropdownOptions={contributionOptions}
          onDropdownSelect={(val) => setContribution(val)}
        />

        {/* Deadline with Calendar in Modal */}
        <FormInput
          label="Deadline"
          placeholder="MM/DD/YYYY"
          value={deadline ? format(deadline, "MM/dd/yyyy") : ""}
          readOnly
          trailingIcon={<CalendarIcon size={18} />}
          onTrailingClick={() => setOpenCal(true)}
          onClick={() => setOpenCal(true)}
        />

        <Modal
          className="md:w-[24rem]"
          open={openCal}
          onClose={() => setOpenCal(false)}
        >
          {/* No extra stopPropagation wrapper needed */}
          <Calendar
            variant="picker"
            value={deadline ?? new Date()}
            onChange={(d: Date) => {
              setDeadline(d);
              setOpenCal(false);
            }}
          />
        </Modal>
      </div>

      {errorMessage ? (
        <p className="text-sm text-system-red">{errorMessage}</p>
      ) : null}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "ADDING REMINDER..." : "ADD REMINDER"}
      </Button>
    </form>
  );
};
export default SetReminder;
