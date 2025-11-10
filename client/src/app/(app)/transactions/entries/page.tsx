"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import ListItem from "@/components/ui/ListItem";
import { Wallet2 } from "lucide-react";

type Entry = {
  id: string;
  title: string;
  description?: string;
  date: string;
  amount: string;
  category: string;
};

// Simulate a larger dataset (replace with API call)
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

// Generate more (mock)
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

export default function EntriesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");
  const [visibleCount, setVisibleCount] = useState(30); // first batch
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const pageSize = 30;
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Filter
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return allEntries.filter(
      (e) =>
        e.title.toLowerCase().includes(q) &&
        (category === "all" || e.category === category)
    );
  }, [query, category]);

  // Slice according to visibleCount
  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  useEffect(() => {
    setVisibleCount(30);
    setHasMore(true);
  }, [filtered.length, query, category]);

  const grouped = useMemo(() => {
    const map: Record<string, Entry[]> = {};
    visible.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return Object.entries(map)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([d, items]) => ({
        date: d,
        items: items.sort((a, b) => a.title.localeCompare(b.title)),
      }));
  }, [visible]);

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
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search transactions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* <WidgetCard title=""> */}
      {grouped.map((group) => (
        <section key={group.date} className="space-y-3">
          <div className="space-y-3">
            {group.items.map((e) => (
              <ListItem
                key={e.id}
                variant="transaction"
                icon={<Wallet2 className="h-5 w-5" />}
                title={e.title}
                description={e.description}
                date={new Date(e.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                amount={e.amount}
              />
            ))}
          </div>
        </section>
      ))}

      {isLoadingMore && <div className="text-center">Loading more...</div>}
      <div ref={sentinelRef} className="h-10"></div>
      {/* </WidgetCard> */}
    </div>
  );
}
