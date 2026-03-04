import { LayoutGrid, ListChecks, QrCode, Settings } from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <Link to="/" className="flex items-center">
                        <span className="text-primary-600 text-xl font-bold">Cart Tracking</span>
                    </Link>

                    <nav className="hidden md:block">
                        <ul className="flex space-x-8">
                            <li>
                                <Link
                                    to="/"
                                    className={`hover:text-primary-600 flex items-center space-x-1 transition-colors ${
                                        isActive('/') ? 'text-primary-600 font-medium' : 'text-gray-600'
                                    }`}
                                >
                                    <LayoutGrid size={18} />
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/carts"
                                    className={`hover:text-primary-600 flex items-center space-x-1 transition-colors ${
                                        isActive('/carts') ? 'text-primary-600 font-medium' : 'text-gray-600'
                                    }`}
                                >
                                    <ListChecks size={18} />
                                    <span>Carts</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/scan"
                                    className={`hover:text-primary-600 flex items-center space-x-1 transition-colors ${
                                        isActive('/scan') ? 'text-primary-600 font-medium' : 'text-gray-600'
                                    }`}
                                >
                                    <QrCode size={18} />
                                    <span>Scan QR</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/settings"
                                    className={`hover:text-primary-600 flex items-center space-x-1 transition-colors ${
                                        isActive('/settings') ? 'text-primary-600 font-medium' : 'text-gray-600'
                                    }`}
                                >
                                    <Settings size={18} />
                                    <span>Settings</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex space-x-4 md:hidden">
                        <Link to="/" className={isActive('/') ? 'text-primary-600' : 'text-gray-600'}>
                            <LayoutGrid />
                        </Link>
                        <Link to="/carts" className={isActive('/carts') ? 'text-primary-600' : 'text-gray-600'}>
                            <ListChecks />
                        </Link>
                        <Link to="/scan" className={isActive('/scan') ? 'text-primary-600' : 'text-gray-600'}>
                            <QrCode />
                        </Link>
                        <Link to="/settings" className={isActive('/settings') ? 'text-primary-600' : 'text-gray-600'}>
                            <Settings />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
