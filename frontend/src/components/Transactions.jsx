import React, { useEffect, useState } from 'react';
import { getTransactions } from '../services/api';
import { ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const data = await getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="text-white text-center py-8">Loading transactions...</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Transactions</h2>
                <p className="text-text-secondary">Your complete trading history</p>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                {transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-dark-bg/50 border-b border-white/5">
                                    <th className="text-left py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Type</th>
                                    <th className="text-left py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Symbol</th>
                                    <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Quantity</th>
                                    <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Price</th>
                                    <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Total Value</th>
                                    <th className="text-right py-4 px-6 text-text-secondary text-xs uppercase tracking-wider font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold border ${tx.type === 'BUY'
                                                    ? 'bg-profit/10 text-profit border-profit/20'
                                                    : 'bg-loss/10 text-loss border-loss/20'
                                                }`}>
                                                {tx.type === 'BUY' ? (
                                                    <ArrowDownLeft className="h-3 w-3" />
                                                ) : (
                                                    <ArrowUpRight className="h-3 w-3" />
                                                )}
                                                <span>{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-white font-bold tracking-wide">{tx.symbol}</td>
                                        <td className="py-4 px-6 text-gray-300 font-mono text-right">{tx.quantity}</td>
                                        <td className="py-4 px-6 text-gray-300 font-mono text-right">{formatCurrency(tx.priceAtTransaction)}</td>
                                        <td className="py-4 px-6 text-white font-medium font-mono text-right">
                                            {formatCurrency(tx.quantity * tx.priceAtTransaction)}
                                        </td>
                                        <td className="py-4 px-6 text-text-secondary text-sm text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <div className="p-1 rounded bg-white/5">
                                                    <Clock className="h-3 w-3" />
                                                </div>
                                                <span>{formatDate(tx.createdAt)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="h-16 w-16 bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <Clock className="h-8 w-8 text-text-secondary" />
                        </div>
                        <p className="text-white font-bold text-xl mb-1">No transactions yet</p>
                        <p className="text-text-secondary text-sm">Start trading to see your history here</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
