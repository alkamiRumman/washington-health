import { format, parseISO } from 'date-fns';
import { Lock, Map, Search, Unlock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Cart } from '../../types';

interface CartListProps {
    carts: Cart[];
}

const CartList: React.FC<CartListProps> = ({ carts }) => {
    const { cartTypes } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    // Get unique locations for filtering
    const locations = Array.from(new Set(carts.map((cart) => cart.location))).sort();

    // Filter carts based on search and filters
    const filteredCarts = carts.filter((cart) => {
        const matchesSearch =
            cart.cartNumber.toLowerCase().includes(searchTerm.toLowerCase()) || cart.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation = locationFilter ? cart.location === locationFilter : true;
        const matchesType = typeFilter ? cart.cartTypeId === typeFilter : true;

        return matchesSearch && matchesLocation && matchesType;
    });

    const getCartTypeName = (cartTypeId: string): string => {
        const cartType = cartTypes.find((type) => type.id === cartTypeId);
        return cartType ? cartType.name : 'Unknown';
    };

    if (carts.length === 0) {
        return (
            <div className="p-8 text-center">
                <p className="mb-4 text-gray-500">No carts found</p>
                <Link to="/carts/new" className="bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 text-white transition-colors">
                    Add Your First Cart
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search carts..."
                        className="w-full rounded-md border border-gray-300 p-2 pl-10"
                    />
                </div>

                <div className="flex gap-4">
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="rounded-md border border-gray-300 p-2"
                    >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                            <option key={location} value={location}>
                                {location}
                            </option>
                        ))}
                    </select>

                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-md border border-gray-300 p-2">
                        <option value="">All Types</option>
                        {cartTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">QR</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Cart Number</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Locks</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Last Checked</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredCarts.map((cart) => (
                            <tr key={cart.id} className="transition-colors hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <QRCodeSVG size={40} value={cart.qrCode} className="flex-shrink-0" />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{cart.cartNumber}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{getCartTypeName(cart.cartTypeId)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Map size={16} className="mr-2 text-gray-400" />
                                        <span className="text-sm text-gray-500">{cart.location}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                cart.mediLock ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                                            }`}
                                        >
                                            {cart.mediLock ? <Lock size={12} className="mr-1" /> : <Unlock size={12} className="mr-1" />}
                                            Medi
                                        </span>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                cart.supplyLock ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'
                                            }`}
                                        >
                                            {cart.supplyLock ? <Lock size={12} className="mr-1" /> : <Unlock size={12} className="mr-1" />}
                                            Supply
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                    {format(parseISO(cart.lastChecked), 'MMM dd, yyyy')}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                    <Link to={`/carts/${cart.id}`} className="text-primary-600 hover:text-primary-900">
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredCarts.length === 0 && (
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-gray-500">No carts match your search criteria</p>
                </div>
            )}
        </div>
    );
};

export default CartList;
