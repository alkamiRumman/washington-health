import { format, parseISO } from 'date-fns';
import { Calendar, ChevronDown, ChevronUp, Clock, Edit, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Drawer, Equipment } from '../../types';

interface DrawerAccordionProps {
    drawer: Drawer;
}

const DrawerAccordion: React.FC<DrawerAccordionProps> = ({ drawer }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const { addEquipment, updateEquipment, deleteEquipment } = useCart();

    const [newEquipment, setNewEquipment] = useState<Omit<Equipment, 'id' | 'drawerId' | 'lastUpdated'>>({
        name: '',
        quantity: 1,
        expiryDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // Default 30 days from now
    });

    const handleToggle = () => {
        setIsOpen(!isOpen);
        // Reset forms when closing
        if (isOpen) {
            setShowAddForm(false);
            setEditingItemId(null);
        }
    };

    const handleAddClick = () => {
        setShowAddForm(!showAddForm);
        setEditingItemId(null);
    };

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addEquipment(drawer.id, newEquipment);
        setNewEquipment({
            name: '',
            quantity: 1,
            expiryDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        });
        setShowAddForm(false);
    };

    const handleEditClick = (equipment: Equipment) => {
        setEditingItemId(equipment.id);
        setShowAddForm(false);
    };

    const handleEditSubmit = (equipment: Equipment) => {
        updateEquipment(equipment);
        setEditingItemId(null);
    };

    const handleDeleteClick = (equipmentId: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteEquipment(equipmentId);
        }
    };

    // Sort equipment by expiry date (earliest first)
    const sortedEquipment = [...drawer.equipment].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

    const getExpiryStatus = (expiryDate: string): { color: string; label: string } => {
        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return { color: 'text-warning-600', label: 'Expired' };
        if (diffDays <= 7) return { color: 'text-warning-600', label: `${diffDays} days left` };
        if (diffDays <= 30) return { color: 'text-orange-500', label: `${diffDays} days left` };
        return { color: 'text-success-500', label: `${diffDays} days left` };
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
            <div
                className={`flex cursor-pointer items-center justify-between bg-gray-50 px-4 py-3 transition-colors ${isOpen ? 'border-b border-gray-200' : ''}`}
                onClick={handleToggle}
            >
                <h4 className="font-medium text-gray-900">{drawer.name}</h4>
                <div className="flex items-center">
                    <span className="mr-3 text-sm text-gray-500">{drawer.equipment.length} items</span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>

            {isOpen && (
                <div className="animate-fade-in p-4">
                    {drawer.equipment.length === 0 && !showAddForm ? (
                        <div className="py-6 text-center">
                            <p className="mb-2 text-gray-500">No equipment in this drawer</p>
                            <button onClick={handleAddClick} className="text-primary-600 hover:text-primary-700 inline-flex items-center">
                                <Plus size={16} className="mr-1" />
                                Add Equipment
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 flex justify-end">
                                <button
                                    onClick={handleAddClick}
                                    className="bg-primary-50 text-primary-600 hover:bg-primary-100 inline-flex items-center rounded-md px-3 py-1.5 transition-colors"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Add Equipment
                                </button>
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleAddSubmit} className="animate-slide-in mb-4 rounded-lg bg-gray-50 p-4">
                                    <h5 className="mb-3 font-medium">Add New Equipment</h5>
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                        <div>
                                            <label className="mb-1 block text-sm text-gray-700">Name*</label>
                                            <input
                                                type="text"
                                                value={newEquipment.name}
                                                onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm text-gray-700">Quantity*</label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={newEquipment.quantity}
                                                onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) })}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm text-gray-700">Expiry Date*</label>
                                            <input
                                                type="date"
                                                value={newEquipment.expiryDate}
                                                onChange={(e) => setNewEquipment({ ...newEquipment, expiryDate: e.target.value })}
                                                className="w-full rounded-md border border-gray-300 p-2"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddForm(false)}
                                            className="rounded-md border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="bg-primary-600 hover:bg-primary-700 rounded-md px-3 py-1.5 text-white">
                                            Add Equipment
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Quantity
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Expiry Date
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Last Updated
                                            </th>
                                            <th className="px-4 py-2 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {sortedEquipment.map((equipment) => (
                                            <React.Fragment key={equipment.id}>
                                                <tr className="hover:bg-gray-50">
                                                    {editingItemId === equipment.id ? (
                                                        <td colSpan={5} className="px-4 py-3">
                                                            <div className="animate-fade-in rounded-lg bg-gray-50 p-3">
                                                                <div className="mb-3 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                                    <div>
                                                                        <label className="mb-1 block text-xs text-gray-500">Name</label>
                                                                        <input
                                                                            type="text"
                                                                            value={equipment.name}
                                                                            onChange={(e) => updateEquipment({ ...equipment, name: e.target.value })}
                                                                            className="w-full rounded-md border border-gray-300 p-1.5 text-sm"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="mb-1 block text-xs text-gray-500">Quantity</label>
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            value={equipment.quantity}
                                                                            onChange={(e) =>
                                                                                updateEquipment({ ...equipment, quantity: parseInt(e.target.value) })
                                                                            }
                                                                            className="w-full rounded-md border border-gray-300 p-1.5 text-sm"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="mb-1 block text-xs text-gray-500">Expiry Date</label>
                                                                        <input
                                                                            type="date"
                                                                            value={equipment.expiryDate}
                                                                            onChange={(e) =>
                                                                                updateEquipment({ ...equipment, expiryDate: e.target.value })
                                                                            }
                                                                            className="w-full rounded-md border border-gray-300 p-1.5 text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => setEditingItemId(null)}
                                                                        className="rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEditSubmit(equipment)}
                                                                        className="bg-primary-600 rounded-md px-2 py-1 text-xs text-white"
                                                                    >
                                                                        Save Changes
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    ) : (
                                                        <>
                                                            <td className="px-4 py-3">
                                                                <div className="font-medium text-gray-900">{equipment.name}</div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="text-sm">{equipment.quantity}</div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center">
                                                                    <Calendar size={14} className="mr-1.5 text-gray-400" />
                                                                    <span className="text-sm">
                                                                        {format(parseISO(equipment.expiryDate), 'MMM dd, yyyy')}
                                                                    </span>
                                                                    <span className={`ml-2 text-xs ${getExpiryStatus(equipment.expiryDate).color}`}>
                                                                        ({getExpiryStatus(equipment.expiryDate).label})
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <Clock size={14} className="mr-1.5 text-gray-400" />
                                                                    {format(parseISO(equipment.lastUpdated), 'MMM dd, yyyy')}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-right">
                                                                <div className="flex justify-end space-x-2">
                                                                    <button
                                                                        onClick={() => handleEditClick(equipment)}
                                                                        className="hover:text-primary-600 text-gray-400"
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteClick(equipment.id)}
                                                                        className="hover:text-warning-600 text-gray-400"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default DrawerAccordion;
