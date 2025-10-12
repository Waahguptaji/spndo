"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import TransactionForm from "@/components/transactions/TransactionForm";
import Modal from "@/components/ui/Modal";
import MobileView from "@/components/transactions/MobileView";
import WebView from "@/components/transactions/WebView";

type Entry = {
  id: string;
  title: string;
  description?: string;
  date: string;
  amount: string;
  category: string;
};

// Sample data (replace with API call)
const baseEntries: Entry[] = [
  {
    id: "1",
    title: "Coffee",
    description: "Starbucks",
    date: "2025-08-27",
    amount: "-$5.40",
    category: "Food",
  },
  {
    id: "2",
    title: "Salary",
    description: "August Payroll",
    date: "2025-08-27",
    amount: "+$3,200.00",
    category: "Income",
  },
  {
    id: "3",
    title: "Groceries",
    description: "Whole Foods",
    date: "2025-08-26",
    amount: "-$86.22",
    category: "Food",
  },
  {
    id: "4",
    title: "Gym Membership",
    description: "Monthly",
    date: "2025-08-26",
    amount: "-$40.00",
    category: "Health",
  },
  {
    id: "5",
    title: "Stocks Dividend",
    description: "ETF payout",
    date: "2025-08-25",
    amount: "+$18.70",
    category: "Income",
  },
];

// Generate more mock data
function generateMock(size = 150): Entry[] {
  const cats = ["Food", "Income", "Health", "Transport", "Bills"];
  const out: Entry[] = [];
  for (let i = 0; i < size; i++) {
    const base = baseEntries[i % baseEntries.length];
    const d = new Date(base.date);
    d.setDate(d.getDate() - Math.floor(i / 5));
    out.push({
      ...base,
      id: `${i + 1}`,
      title: `${base.title} ${i + 1}`,
      date: d.toISOString().slice(0, 10),
      category: cats[i % cats.length],
      amount:
        i % 7 === 0
          ? `+$${(50 + (i % 9) * 13).toFixed(2)}`
          : `-$${(5 + (i % 17) * 3.2).toFixed(2)}`,
    });
  }
  return out;
}

const allEntries = generateMock();

export type Column = {
  id: string;
  label: string;
  visible: boolean;
};

const defaultColumns: Column[] = [
  { id: "date", label: "Date", visible: true },
  { id: "title", label: "Title", visible: true },
  { id: "description", label: "Description", visible: true },
  { id: "amount", label: "Amount", visible: true },
  { id: "category", label: "Category", visible: true },
];

const Transactions = () => {
  const router = useRouter();

  const [active, setActive] = useState<"income" | "expense" | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  const [filterOpen, setFilterOpen] = useState(false);
  const [columnOpen, setColumnOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [visibleCount, setVisibleCount] = useState(30);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 30;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleAdd = (type: "income" | "expense") => {
    if (isMobile) {
      setActive(null);
      router.push(type === "income" ? "/addIncome" : "/addExpense");
    } else {
      setActive(type);
    }
  };

  const handleClose = () => setActive(null);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === id ? { ...col, visible: !col.visible } : col
      )
    );
  };

  const resetColumns = () => setColumns(defaultColumns);

  const isIncomeTransaction = (amount: string) => amount.startsWith("+");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allEntries
      .filter((e) => {
        const matchesQuery =
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          false;
        const matchesCategory = category === "all" || e.category === category;
        const matchesType =
          typeFilter === "all" ||
          (typeFilter === "income" && isIncomeTransaction(e.amount)) ||
          (typeFilter === "expense" && !isIncomeTransaction(e.amount));

        return matchesQuery && matchesCategory && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === "date") {
          return sortOrder === "asc"
            ? a.date.localeCompare(b.date)
            : b.date.localeCompare(a.date);
        } else if (sortBy === "amount") {
          const amountA = parseFloat(a.amount.replace(/[^0-9.-]+/g, ""));
          const amountB = parseFloat(b.amount.replace(/[^0-9.-]+/g, ""));
          return sortOrder === "asc" ? amountA - amountB : amountB - amountA;
        } else {
          return sortOrder === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
      });
  }, [query, category, typeFilter, sortBy, sortOrder]);

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(30);
    setHasMore(true);
  }, [filtered.length, query, category, typeFilter, sortBy, sortOrder]);

  const grouped = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    visible.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map)
      .sort((a, b) =>
        sortBy === "date" && sortOrder === "asc"
          ? a[0].localeCompare(b[0])
          : b[0].localeCompare(a[0])
      )
      .map(([d, items]) => ({
        date: d,
        items: items.sort((a, b) => a.title.localeCompare(b.title)),
      }));
  }, [visible, sortBy, sortOrder]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + pageSize, filtered.length));
      setIsLoadingMore(false);
      setHasMore(visibleCount + pageSize < filtered.length);
    }, 500); // Simulate loading delay
  }, [filtered.length, hasMore, isLoadingMore, visibleCount, pageSize]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, hasMore, grouped]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(allEntries.map((e) => e.category)))],
    []
  );

  return (
    <>
      <Modal
        className="p-6"
        open={!!active}
        onClose={handleClose}
        title={
          active ? (active === "income" ? "Add Income" : "Add Expense") : ""
        }
      >
        {active && <TransactionForm kind={active} />}
      </Modal>

      {isMobile ? (
        <MobileView active={active} handleAdd={handleAdd} />
      ) : (
        <WebView
          active={active}
          handleAdd={handleAdd}
          query={query}
          setQuery={setQuery}
          filterOpen={filterOpen}
          setFilterOpen={setFilterOpen}
          columnOpen={columnOpen}
          setColumnOpen={setColumnOpen}
          categories={categories}
          category={category}
          setCategory={setCategory}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          columns={columns}
          toggleColumn={toggleColumn}
          resetColumns={resetColumns}
          filtered={filtered} // This should be the filtered array of transactions
          isLoadingMore={isLoadingMore}
          sentinelRef={sentinelRef}
          loadMore={loadMore}
        />
      )}
    </>
  );
};

export default Transactions;
