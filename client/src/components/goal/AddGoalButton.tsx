"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import AddGoalForm from "./AddGoalForm";
import { GoalResponse } from "@/lib/api/goals";

type Props = {
  label?: string;
  onGoalAdded?: (goal: GoalResponse) => void;
};

const AddGoalButton: React.FC<Props> = ({ label = "+ Add Goal", onGoalAdded }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    if (isMobile) router.push("/goals/add");
    else setOpen(true);
  };

  return (
    <>
      <Button onClick={handleClick}>{label}</Button>
      <Modal
        className="p-6"
        open={open}
        onClose={() => setOpen(false)}
        title="Add Goal"
      >
        <AddGoalForm
          onSuccess={(createdGoal) => {
            setOpen(false);
            if (createdGoal) onGoalAdded?.(createdGoal);
          }}
        />
      </Modal>
    </>
  );
};

export default AddGoalButton;
