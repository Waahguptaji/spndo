import React from "react";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import Button from "@/components/ui/Button"; // Fixed import with correct casing
import Modal from "@/components/ui/Modal";
import FilterPanel from "@/components/transactions/FilterPanel";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import CategoryChip from "../ui/CategoryChip";

type Entry = {
  id: string;
  title: string;
  description?: string;
  date: string;
  amount: string;
  category: string;
};

type Column = {
  id: string;
  label: string;
  visible: boolean;
};

type WebViewProps = {
  handleAdd: (type: "income" | "expense") => void;
  active: "income" | "expense" | null;
  query: string;
  setQuery: (query: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  columnOpen: boolean;
  setColumnOpen: (open: boolean) => void;
  categories: string[];
  category: string;
  setCategory: (category: string) => void;
  typeFilter: "all" | "income" | "expense";
  setTypeFilter: (type: "all" | "income" | "expense") => void;
  sortBy: "date" | "amount" | "title";
  setSortBy: (sort: "date" | "amount" | "title") => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  columns: Column[];
  toggleColumn: (id: string) => void;
  resetColumns: () => void;
  filtered: Entry[];
  isLoadingMore: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
};

const WebView: React.FC<WebViewProps> = ({
  active,
  handleAdd,
  query,
  setQuery,
  filterOpen,
  setFilterOpen,
  columnOpen,
  setColumnOpen,
  categories,
  category,
  setCategory,
  typeFilter,
  setTypeFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  columns,
  toggleColumn,
  resetColumns,
  filtered,
  isLoadingMore,
  sentinelRef,
  loadMore,
}) => {
  const resetFilters = () => {
    setCategory("all");
    setTypeFilter("all");
    setSortBy("date");
    setSortOrder("desc");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4">
      {/* Title and action buttons */}
      <div className="text-center">
        <div className="flex justify-center gap-6">
          <CategoryChip
            label="Add Income"
            icon={<ArrowUpRight className="h-6 w-6 text-green-500" />}
            selected={active === "income"}
            onClick={() => handleAdd("income")}
            className="h-24 w-40 rounded-3xl"
          />
          <CategoryChip
            label="Add Expense"
            icon={<ArrowDownLeft className="h-6 w-6 text-red-500" />}
            selected={active === "expense"}
            onClick={() => handleAdd("expense")}
            className="h-24 w-40 rounded-3xl"
          />
        </div>
      </div>

      {/* Filter panel */}
      <FilterPanel
        query={query}
        onQueryChange={setQuery}
        onFilterToggle={() => setFilterOpen(!filterOpen)}
        onColumnToggle={() => setColumnOpen(!columnOpen)}
      />

      {/* Filter modal */}
      <Modal
        className="p-6"
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Filter Transactions"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Type</label>
            <div className="flex gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  checked={typeFilter === "all"}
                  onChange={() => setTypeFilter("all")}
                />
                All
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  checked={typeFilter === "income"}
                  onChange={() => setTypeFilter("income")}
                />
                Income
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  checked={typeFilter === "expense"}
                  onChange={() => setTypeFilter("expense")}
                />
                Expense
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Sort By</label>
            <div className="flex gap-3 flex-wrap">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "date"}
                  onChange={() => setSortBy("date")}
                />
                Date
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "amount"}
                  onChange={() => setSortBy("amount")}
                />
                Amount
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sortBy"
                  checked={sortBy === "title"}
                  onChange={() => setSortBy("title")}
                />
                Title
              </label>

              <div className="w-full mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sortOrder"
                    checked={sortOrder === "asc"}
                    onChange={() => setSortOrder("asc")}
                  />
                  Ascending
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="sortOrder"
                    checked={sortOrder === "desc"}
                    onChange={() => setSortOrder("desc")}
                  />
                  Descending
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={resetFilters}>
            Reset
          </Button>
          <Button onClick={() => setFilterOpen(false)}>Apply</Button>
        </div>
      </Modal>

      {/* Column settings modal */}
      <Modal
        className="p-6"
        open={columnOpen}
        onClose={() => setColumnOpen(false)}
        title="Manage Columns"
      >
        <div className="space-y-2">
          {columns.map((col) => (
            <label key={col.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => toggleColumn(col.id)}
              />
              {col.label}
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" className="mr-2" onClick={resetColumns}>
            Reset
          </Button>
          <Button onClick={() => setColumnOpen(false)}>Apply</Button>
        </div>
      </Modal>

      {/* Transaction table */}
      <TransactionsTable
        data={filtered}
        onLoadMore={loadMore}
        isLoadingMore={isLoadingMore}
        sentinelRef={sentinelRef}
      />
    </div>
  );
};

export default WebView;
