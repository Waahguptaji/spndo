"use client";
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import FormInput from "../ui/FormInput";
import Button from "../ui/Button";
import Calendar from "../ui/calendar";
import Modal from "../ui/Modal";

const contributionOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function formatAmountInput(v: string) {
  const digits = v.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-IN");
}

const AddGoalForm = () => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [contribution, setContribution] = useState<string | null>("yearly");
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [openCal, setOpenCal] = useState(false);

  const contributionLabel =
    contributionOptions.find((o) => o.value === contribution)?.label ?? "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // submit values: { title, amount, contribution, deadline }
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
          label="Contribution Type"
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

      <Button type="submit" className="w-full">
        ADD GOAL
      </Button>
    </form>
  );
};
export default AddGoalForm;
