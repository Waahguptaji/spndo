import { Calendar, TrendingDown, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
var document = window.document;
const style = document.createElement('style');

style.innerHTML = `
.no-scrollbar::-webkit-scrollbar {
display: none;
}
.no-scrollbar {
-ms-overflow-style: none; /* IE and Edge */
scrollbar-width: none; /* Firefox */
}`;

document.head.appendChild(style);
const DashboardSummary = () => {
    // State for each card's amount to allow for dynamic updates
    const [savings, setSavings] = useState(50280);
    const [totalExpenses, setTotalExpenses] = useState(25140);
    const [monthlyBudget, setMonthlyBudget] = useState(5000);

    // Simulate fetching data from an API
    useEffect(() => {
        const timer = setTimeout(() => {
            setSavings((prev: number) => prev + Math.floor(Math.random() * 1000 - 500));
            setTotalExpenses((prev: number) => prev + Math.floor(Math.random() * 1000 - 500));
            setMonthlyBudget((prev: number) => prev + Math.floor(Math.random() * 1000 - 500));
        }, 2000);

        return () => clearTimeout(timer);
    }, [savings, totalExpenses, monthlyBudget]); // Re-run if any value changes to simulate real-time updates

    return (
        <div className="flex space-x-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:space-x-0 no-scrollbar mx-2 ">
            <SummaryCard variant="savings" title="Total Savings" amount={savings} />
            <SummaryCard variant="totalExpenses" title="Total Expenses" amount={totalExpenses} />
            <SummaryCard variant="monthlyExpenses" title="Budget" amount={monthlyBudget} />
        </div>
    );
};

// Internal SummaryCard component, driven by a 'variant' prop.
type SummaryCardProps = {
    variant: 'savings' | 'totalExpenses' | 'monthlyExpenses';
    title: string;
    amount: number;
};

const SummaryCard = ({ variant, title, amount }: SummaryCardProps) => {
    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    const styleVariants = {
        savings: { icon: Wallet, iconBgColor: 'bg-green-100 dark:bg-green-900/50', iconColor: 'text-green-600 dark:text-green-400' },
        totalExpenses: { icon: TrendingDown, iconBgColor: 'bg-red-100 dark:bg-red-900/50', iconColor: 'text-red-600 dark:text-red-400' },
        monthlyExpenses: { icon: Calendar, iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/50', iconColor: 'text-yellow-600 dark:text-yellow-400' },
    };

    const { icon: Icon, iconBgColor, iconColor } = styleVariants[variant];

    return (
        <div className="bg-white dark:bg-neutral-dark2 p-4 rounded-lg shadow-xl flex flex-col items-baseline md:items-center md:flex-row space-x-4 flex-shrink-0 w-44 md:w-auto gap-2 md:gap-0">
            <div className={`p-3 rounded-full ${iconBgColor}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div className="flex flex-col md:block gap-3 md:gap-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(amount)}
                </p>
            </div>
        </div>
    );
};
export default DashboardSummary;
