import GoalsWidget from "@/components/dashboard/GoalsWidget";
import CircularPulseStat from "@/components/ui/CircularPulseStat";

export default function SavingsPage() {
  return (
    <div className="p-4 space-y-8">
      <CircularPulseStat
        amount={1600}
        percentage={60}
        label="You have spent total"
        variant="savings"
        size="md"
      />
      <div></div>
      <GoalsWidget />
    </div>
  );
}
