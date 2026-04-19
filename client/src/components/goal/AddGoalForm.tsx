"use client";
import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import Calendar from "../ui/calendar";
import Modal from "../ui/Modal";
import { addGoal, updateGoal } from "@/lib/api/goals";
import { GoalResponse } from "@/lib/api/goals";

type Props = {
  goal?: GoalResponse;
  onSuccess?: (updatedGoal?: GoalResponse) => void;
};
type GoalStatus = "active" | "completed" | "cancelled" | "paused";
const contributionOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];
const goalEnum: { value: GoalStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
];

function formatAmountInput(v: string): number {
  const digits = v.replace(/[^\d.]/g, "");
  if (!digits) return 0;
  return Number(digits);
}

const AddGoalForm = ({ goal, onSuccess }: Props) => {
  const [title, setTitle] = useState(goal?.title || "");
  const [amount, setAmount] = useState<number>(goal?.target_amount || 0);
  const [progressAmount, setProgressAmount] = useState<number>(
    goal?.progress_amount || 0,
  );
  const [contribution, setContribution] = useState("yearly");
  const [status, setStatus] = useState<GoalStatus>(goal?.status || "active");
  const [deadline, setDeadline] = useState<Date | null>(goal?.deadline || null);
  const [openCal, setOpenCal] = useState(false);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setAmount(goal.target_amount);
      setProgressAmount(goal.progress_amount);
      setStatus(goal.status as GoalStatus);
      setDeadline(goal.deadline ? new Date(goal.deadline) : null);
    }
  }, [goal]);
  const contributionLabel =
    contributionOptions.find((o) => o.value === contribution)?.label ?? "";
  const statusEnum = goalEnum.find((o) => o.value === status)?.label ?? "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!deadline) return;
    // submit values: { title, amount, contribution, deadline }
    const payload = {
      title: title,
      target_amount: Number(amount),
      deadline: deadline.toISOString(),
      status: status,
      progress_amount: Number(progressAmount),
    };
    try {
      let updatedGoal;

      if (goal) {
        updatedGoal = await updateGoal(goal.id, payload);
      } else {
        updatedGoal = await addGoal(payload);
      }

      onSuccess?.(updatedGoal);
    } catch (err) {
      console.error("Error saving goal:", err);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col gap-6">
        <FormInput
          label="Goal Title"
          placeholder="Enter your goal title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <FormInput
          label="Amount"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(formatAmountInput(e.target.value))}
          inputMode="numeric"
          suffixText="$"
        />
        <FormInput
          label="Progress Amount"
          placeholder="0"
          value={progressAmount}
          onChange={(e) => setProgressAmount(formatAmountInput(e.target.value))}
          inputMode="numeric"
          suffixText="$"
        />

        <FormInput
          label="Contribution Type"
          placeholder="Select"
          value={contributionLabel}
          readOnly
          hasDropdown
          dropdownOptions={contributionOptions}
          onDropdownSelect={(val) => setContribution(val)}
        />
        <FormInput
          label="Status"
          placeholder="Select"
          value={statusEnum}
          readOnly
          hasDropdown
          dropdownOptions={goalEnum}
          onDropdownSelect={(val) => setStatus(val as GoalStatus)}
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

      <Button type="submit" className="w-full">
        {goal ? "Upadate goal" : "Add Goal"}
      </Button>
    </form>
  );
};
export default AddGoalForm;
