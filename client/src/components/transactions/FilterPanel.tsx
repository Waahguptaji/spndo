import React from "react";
import { Filter, SlidersHorizontal } from "lucide-react";
import Button from "@/components/ui/Button"; // Fixed import with correct casing

type FilterPanelProps = {
  query: string;
  onQueryChange: (value: string) => void;
  onFilterToggle: () => void;
  onColumnToggle: () => void;
};

export default function FilterPanel({
  query,
  onQueryChange,
  onFilterToggle,
  onColumnToggle,
}: FilterPanelProps) {
  return (
    <div className="flex justify-between items-center gap-4 mb-4 ">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search transactions..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="w-full p-2 pl-10 border border-neutral-softGrey1 dark:border-neutral-grey1  rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-brand/60 focus:ring-offset-2 dark:focus:ring-offset-neutral-dark2 outline-primary-brand bg-neutral-white dark:bg-neutral-dark2"
        />
        <Filter
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={16}
        />
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onFilterToggle}
        >
          <Filter size={16} /> Filter
        </Button>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onColumnToggle}
        >
          <SlidersHorizontal size={16} /> Columns
        </Button>
      </div>
    </div>
  );
}
