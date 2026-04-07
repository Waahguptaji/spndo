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
import { getTransactions, Transaction } from "@/lib/api/transactions";
import { getCategories } from "@/lib/api/categories";

type Entry = {
  id: string;
  title: string;
  description?: string;
  date: string;
  amount: string;
  category: string;
};

type FormCategory = {
  id: string;
  label: string;
};

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
    "all",
  );
  const [columns, setColumns] = useState<Column[]>(defaultColumns);
  const [sortBy, setSortBy] = useState<"date" | "amount" | "title">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [visibleCount, setVisibleCount] = useState(30);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 30;

  const sentinelRef = useRef<HTMLDivElement>(null!);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [expenseCats, setExpenseCats] = useState<FormCategory[]>([]);
  const [incomeCats, setIncomeCats] = useState<FormCategory[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getTransactions();
        const tx = res?.transactions ?? [];
        setTransactions(tx);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    const preFetchCategories = async () => {
      try {
        const res = await getCategories();
        setExpenseCats(
          res.categories
            .filter((category) => category.type === "EXPENSE")
            .map((category) => ({ id: category.id, label: category.name })),
        );
        setIncomeCats(
          res.categories
            .filter((category) => category.type === "INCOME")
            .map((category) => ({ id: category.id, label: category.name })),
        );
      } catch (err) {
        console.error("Error pre-fetching categories:", err);
      }
    };
    preFetchCategories();
  }, []);

  const allEntries = useMemo(() => {
    return transactions.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.note ?? undefined,
      date: t.occurred_at,
      category: t.category?.name || "Other",
      amount:
        t.type === "INCOME" ? `+$${Number(t.amount)}` : `-$${Number(t.amount)}`,
    }));
  }, [transactions]);

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
        col.id === id ? { ...col, visible: !col.visible } : col,
      ),
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
  }, [allEntries, query, category, typeFilter, sortBy, sortOrder]);

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
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
          : b[0].localeCompare(a[0]),
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
      { threshold: 1.0 },
    );
    observerRef.current.observe(sentinelRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMore, hasMore, grouped]);

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(allEntries.map((e) => e.category)))],
    [allEntries],
  );

  if (loading) {
    return <div className="p-6 text-center">Loading transactions...</div>;
  }

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
        {active && (
          <TransactionForm
            kind={active}
            initialExpenseCats={expenseCats}
            initialIncomeCats={incomeCats}
            onSuccess={async () => {
              try {
                const res = await getTransactions();
                setTransactions(res?.transactions ?? []);
              } catch (err) {
                console.error("Error refreshing transactions:", err);
              } finally {
                handleClose();
              }
            }}
          />
        )}
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
          isLoadingMore={isLoadingMore}
          sentinelRef={sentinelRef}
          loadMore={loadMore}
          filtered={filtered}
        />
      )}
    </>
  );
};

export default Transactions;
