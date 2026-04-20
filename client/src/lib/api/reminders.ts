import apiFetch from "../apiClient";

export type ReminderRepeat = "NONE" | "DAILY" | "WEEKLY" | "MONTHLY";

export type Reminder = {
  id: string;
  user_id: string;
  title: string;
  note?: string | null;
  due_at: string;
  repeat: ReminderRepeat;
  is_done: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateReminderInput = {
  title: string;
  note?: string;
  due_at: string;
  repeat: ReminderRepeat;
  is_done?: boolean;
};

type GetRemindersResponse = {
  reminders: Reminder[];
};

type CreateReminderResponse = {
  message: string;
  reminder: Reminder;
};

export const getReminders = async (): Promise<GetRemindersResponse> => {
  return apiFetch("/reminders");
};

export const createReminder = async (
  data: CreateReminderInput,
): Promise<CreateReminderResponse> => {
  return apiFetch("/reminders", {
    method: "POST",
    body: {
      ...data,
      is_done: data.is_done ?? false,
    },
  });
};

export const toggleReminder = async (id: string) => {
  return apiFetch(`/reminders/${id}`, {
    method: "PATCH",
  });
};

export const deleteReminder = async (id: string) => {
  return apiFetch(`/reminders/${id}`, {
    method: "DELETE",
  });
};
