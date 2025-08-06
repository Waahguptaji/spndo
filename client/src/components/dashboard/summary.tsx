'use client';
import {useEffect, useState} from "react";

import {Wallet, TrendingDown, Calendar} from 'lucide-react';
import SummaryCard from './SummaryWidget';
const style = document.createElement('style');
    style.innerHTML = `
      .no-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .no-scrollbar {
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
      }
    `;
    document.head.appendChild(style);
const SummaryRow = () => {
    // Initial static data
    const initialData = [
        { icon: Wallet, title: 'Total Savings', amount: 50280, iconBgColor: 'bg-green-100 dark:bg-green-900/50', iconColor: 'text-green-600 dark:text-green-400' },
        { icon: TrendingDown, title: 'Total Expenses', amount: 25140, iconBgColor: 'bg-red-100 dark:bg-red-900/50', iconColor: 'text-red-600 dark:text-red-400' },
        { icon: Calendar, title: 'Budget', amount: 5000, iconBgColor: 'bg-yellow-100 dark:bg-yellow-900/50', iconColor: 'text-yellow-600 dark:text-yellow-400' },
    ];

    const [summaryData, setSummaryData] = useState(initialData);

    // Simulate fetching data from an API
    useEffect(() => {
        const timer = setTimeout(() => {
            
            // For now, we'll just update the amounts with new random numbers.
            const newData = summaryData.map(card => ({
                ...card,
                amount: card.amount + Math.floor(Math.random() * 1000 - 500), 
            }));
            setSummaryData(newData);
            console.log("Simulated API fetch: Data updated!");
        }, 2000); // Update after 2 seconds

        return () => clearTimeout(timer); 
    }, [summaryData]);

    return (
        <div className="flex space-x-4 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:space-x-0 no-scrollbar mx-2 ">
            {summaryData.map((data) => (
                <SummaryCard key={data.title} {...data} />
            ))}
        </div>
    );
};
export default SummaryRow;