"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import AddGoalForm from "./AddGoalForm";

type Props = { label?: string };

const AddGoalButton: React.FC<Props> = ({ label = "+ Add Goal" }) => {
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
        <AddGoalForm />
      </Modal>
    </>
  );
};

export default AddGoalButton;
