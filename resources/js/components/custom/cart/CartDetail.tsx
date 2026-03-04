import { format, parseISO } from 'date-fns';
import { Calendar, Clock, Edit, Lock, Map, Unlock } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Cart, CartType, Drawer } from '../../types';
import DrawerAccordion from './DrawerAccordion';

interface CartDetailProps {
    cart: Cart;
    cartType: CartType;
}

const CartDetail: React.FC<CartDetailProps> = ({ cart, cartType }) => {
    const { updateLockStatus } = useCart();
    const [isEditing, setIsEditing] = useState(false);
    const [editedLocation, setEditedLocation] = useState(cart.location);

    const handleToggleLock = (lockType: 'mediLock' | 'supplyLock') => {
        updateLockStatus(cart.id, lockType, !cart[lockType]);
    };

    const handleSaveLocation = () => {
        // In a real app, we would update the location in the API
        setIsEditing(false);
    };

    return (
        <div className="animate-fade-in space-y-8">
            <div className="rounded-lg bg-gray-50 p-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <div>
                        <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">Cart Information</h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-sm text-gray-500">Cart Number:</span>
                                <p className="font-medium">{cart.cartNumber}</p>
                            </div>
                            <div>
                                <span className="text-sm text-gray-500">Type:</span>
                                <p className="font-medium">{cartType.name}</p>
                            </div>
                            <div className="flex items-start">
                                <Map size={18} className="mt-0.5 mr-2 text-gray-400" />
                                {isEditing ? (
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={editedLocation}
                                            onChange={(e) => setEditedLocation(e.target.value)}
                                            className="rounded-md border border-gray-300 p-1 text-sm"
                                        />
                                        <button onClick={handleSaveLocation} className="bg-primary-600 ml-2 rounded px-2 py-1 text-xs text-white">
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-medium">{cart.location}</span>
                                        <button onClick={() => setIsEditing(true)} className="ml-2 text-gray-400 hover:text-gray-600">
                                            <Edit size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">Lock Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleToggleLock('mediLock')}
                                    className={`mr-3 rounded-full p-2 ${
                                        cart.mediLock ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'
                                    }`}
                                >
                                    {cart.mediLock ? <Lock size={18} /> : <Unlock size={18} />}
                                </button>
                                <div>
                                    <p className="font-medium">Medi Lock</p>
                                    <p className="text-xs text-gray-500">{cart.mediLock ? 'Locked' : 'Unlocked'}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <button
                                    onClick={() => handleToggleLock('supplyLock')}
                                    className={`mr-3 rounded-full p-2 ${
                                        cart.supplyLock ? 'bg-success-100 text-success-600' : 'bg-warning-100 text-warning-600'
                                    }`}
                                >
                                    {cart.supplyLock ? <Lock size={18} /> : <Unlock size={18} />}
                                </button>
                                <div>
                                    <p className="font-medium">Supply Lock</p>
                                    <p className="text-xs text-gray-500">{cart.supplyLock ? 'Locked' : 'Unlocked'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2 text-xs font-medium tracking-wider text-gray-500 uppercase">Additional Information</h3>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Calendar size={18} className="mr-2 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Last Checked:</p>
                                    <p className="font-medium">{format(parseISO(cart.lastChecked), 'MMMM dd, yyyy')}</p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <Clock size={18} className="mr-2 text-gray-400" />
                                <div>
                                    <p className="text-sm text-gray-500">Total Items:</p>
                                    <p className="font-medium">{cart.drawers.reduce((sum, drawer) => sum + drawer.equipment.length, 0)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-md">
                            <QRCodeSVG size={64} value={cart.qrCode} className="flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-gray-700">QR Code</p>
                                <p className="mt-1 rounded bg-gray-100 px-2 py-1 font-mono text-xs break-all text-gray-600">{cart.qrCode}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">Drawers</h3>
                <div className="space-y-4">
                    {cart.drawers.map((drawer: Drawer) => (
                        <DrawerAccordion key={drawer.id} drawer={drawer} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CartDetail;
