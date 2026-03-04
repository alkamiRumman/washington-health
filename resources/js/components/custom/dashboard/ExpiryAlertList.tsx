import { ExpiryAlert } from '@/types';
import { AlertTriangle, Clock } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface ExpiryAlertListProps {
    alerts: ExpiryAlert[];
}

const ExpiryAlertList: React.FC<ExpiryAlertListProps> = ({ alerts }) => {
    const getSeverityColor = (daysRemaining: number): string => {
        if (daysRemaining <= 7) return 'text-warning-600 bg-warning-50';
        if (daysRemaining <= 14) return 'text-orange-600 bg-orange-50';
        return 'text-yellow-600 bg-yellow-50';
    };

    if (alerts.length === 0) {
        return (
            <div className="rounded-lg bg-gray-50 p-6 text-center">
                <p className="text-gray-500">No expiry alerts at this time.</p>
            </div>
        );
    }

    return (
        <ul className="divide-y divide-gray-100">
            {alerts.map((alert, index) => (
                <li key={index} className="animate-slide-in py-3" style={{ animationDelay: `${index * 50}ms` }}>
                    <Link to={`/carts/${alert.cartId}`} className="flex items-start rounded-md p-2 transition-colors hover:bg-gray-50">
                        <div className={`mr-3 rounded-full p-2 ${getSeverityColor(alert.daysRemaining)}`}>
                            {alert.daysRemaining <= 7 ? <AlertTriangle size={18} /> : <Clock size={18} />}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex justify-between">
                                <p className="truncate text-sm font-medium text-gray-900">{alert.equipmentName}</p>
                                <span className="text-xs font-medium">
                                    {alert.daysRemaining} {alert.daysRemaining === 1 ? 'day' : 'days'} left
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-gray-500">
                                Cart: {alert.cartNumber} | Location: {alert.location}
                            </p>
                            <p className="text-xs text-gray-500">Expires: {alert.expiryDate}</p>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default ExpiryAlertList;
