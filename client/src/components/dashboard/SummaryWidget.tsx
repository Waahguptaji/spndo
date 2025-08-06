type SummaryCardProps = {
    icon: React.ElementType;
    title: string;
    amount: number;
    iconBgColor: string;
    iconColor: string;
};

const SummaryCard = ({ icon: Icon, title, amount, iconBgColor, iconColor }: SummaryCardProps) => {
    const formatCurrency = (num: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <div className="bg-white dark:bg-neutral-dark2 p-4 rounded-lg shadow-xl flex items-center space-x-4 flex-shrink-0 w-64 md:w-auto">
            <div className={`p-3 rounded-full ${iconBgColor}`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                    {formatCurrency(amount)}
                </p>
            </div>
        </div>
    );
};

export default SummaryCard