import {ArrowUp, ArrowDown} from 'lucide-react';


const SummaryWidget = () => {
    const balance = 12500.75;
    const creditCardDebt = -2750.50;
    const netTotal = balance + creditCardDebt;

    // Helper to format numbers as currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="bg-neutral-white dark:bg-neutral-dark2 p-4 rounded-lg shadow-md w-full max-w-md mx-auto">
            <div className="space-y-4">
                {/* Balance Section */}
                <div>
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                        <span>Balance</span>
                        <ArrowUp className="w-5 h-5 text-primary-darkBrand" />
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white ">
                        {formatCurrency(balance)}
                    </p>
                </div>

                {/* Credit Cards Section */}
                <div>
                    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                        <span>Credit cards</span>
                        <ArrowDown className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">
                        {formatCurrency(creditCardDebt)}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <hr className="my-4 border-gray-200 dark:border-gray-700" />

            {/* Total Section */}
            <div>
                <p className="text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-primary-darkBrand mt-1">
                    {formatCurrency(netTotal)}
                </p>
            </div>
        </div>
    );
};
export default SummaryWidget;