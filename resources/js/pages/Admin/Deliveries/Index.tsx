import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import { Pagination } from '@/components/custom/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { Delivery, PaginatedData, User, Vehicle } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Calendar as CalendarIcon, Download, Eye, FileText, Filter, Trash2, Truck, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface DeliveriesProps {
    deliveries: PaginatedData<Delivery>;
    drivers: User[];
    vehicles: Vehicle[];
    filters: {
        status: string;
        driver_id: string;
        vehicle_id: string;
        date_from: string;
        date_to: string;
    };
}

export default function Index({ deliveries, drivers, vehicles, filters }: DeliveriesProps) {
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const { data, setData, get, processing } = useForm({
        status: filters.status || '',
        driver_id: filters.driver_id || '',
        vehicle_id: filters.vehicle_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('admin.deliveries'), { preserveState: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (data.status) params.set('status', data.status);
        if (data.driver_id) params.set('driver_id', data.driver_id);
        if (data.vehicle_id) params.set('vehicle_id', data.vehicle_id);
        if (data.date_from) params.set('date_from', data.date_from);
        if (data.date_to) params.set('date_to', data.date_to);
        window.open(route('admin.deliveries.export') + (params.toString() ? '?' + params.toString() : ''), '_blank');
    };

    const statusConfig: Record<string, { label: string; color: string }> = {
        pending: {
            label: 'Pending',
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200',
        },
        assigned: {
            label: 'Assigned',
            color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200',
        },
        in_progress: {
            label: 'In Progress',
            color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200',
        },
        completed: {
            label: 'Completed',
            color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200',
        },
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Deliveries', href: '/admin/deliveries' }]}>
            <Head title="All Deliveries" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Deliveries Management</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Monitor fleet operations and track service compliance.</p>
                    </div>
                    <div className="flex w-full gap-2 md:w-auto">
                        <Button variant="outline" onClick={handleExport} className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                    </div>
                </div>

                <Card className="pt-0 shadow-sm">
                    <CardHeader className="border-b bg-indigo-100 py-4 dark:bg-indigo-900/50">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Filter className="h-4 w-4" />
                            Filter Deliveries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-1 items-end gap-4 text-sm sm:grid-cols-2 lg:grid-cols-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="status">Status</Label>
                                <Select value={data.status || 'all'} onValueChange={(v) => setData('status', v === 'all' ? '' : v)}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="All Statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Statuses</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="assigned">Assigned</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="driver">Driver</Label>
                                <Select value={data.driver_id || 'all'} onValueChange={(v) => setData('driver_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger id="driver">
                                        <SelectValue placeholder="All Drivers" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Drivers</SelectItem>
                                        {drivers.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>
                                                {d.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="vehicle">Vehicle</Label>
                                <Select value={data.vehicle_id || 'all'} onValueChange={(v) => setData('vehicle_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger id="vehicle">
                                        <SelectValue placeholder="All Vehicles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Vehicles</SelectItem>
                                        {vehicles.map((v) => (
                                            <SelectItem key={v.id} value={String(v.id)}>
                                                {v.vehicle_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Date From</Label>
                                <DatePicker value={data.date_from} onChange={(v) => setData('date_from', v)} placeholder="From date" />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Date To</Label>
                                <DatePicker value={data.date_to} onChange={(v) => setData('date_to', v)} placeholder="To date" />
                            </div>
                            <div className="flex items-center gap-2 lg:col-span-1">
                                <Button type="submit" disabled={processing} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-500">
                                    <Filter className="h-4 w-4" />
                                    Apply
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Schedule</TableHead>
                                <TableHead>Route</TableHead>
                                <TableHead>Assignees</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No deliveries found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                deliveries.data.map((delivery) => {
                                    const status = statusConfig[delivery.status] || { label: delivery.status, color: '' };
                                    return (
                                        <TableRow
                                            key={delivery.id}
                                            className="group transition-colors hover:cursor-pointer hover:bg-muted/50"
                                            onClick={() => router.visit(route('admin.deliveries.show', delivery.id))}
                                        >
                                            <TableCell className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                                #{delivery.id}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {new Date(delivery.scheduled_time).toLocaleDateString(undefined, {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-1 flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                                                        <span className="max-w-[150px] truncate text-sm font-medium" title={delivery.pickup_location}>
                                                            {delivery.pickup_location}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                                                        <span
                                                            className="max-w-[150px] truncate text-sm font-medium"
                                                            title={delivery.delivery_location}
                                                        >
                                                            {delivery.delivery_location}
                                                        </span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {delivery.driver ? (
                                                            <span className="font-medium">{delivery.driver.name}</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                                                        {delivery.vehicle ? (
                                                            <span className="font-medium">{delivery.vehicle.vehicle_number}</span>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground italic">Unassigned</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={`border px-2.5 py-0.5 text-[10px] font-bold tracking-wider whitespace-nowrap uppercase ${status.color}`}
                                                >
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-1.5 transition-opacity">
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-600 hover:text-blue-700">
                                                        <a
                                                            href={route('compliance.export', delivery.id)}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            title="Export PDF"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-gray-600">
                                                        <Link href={route('admin.deliveries.show', delivery.id)} title="View Details">
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700"
                                                        onClick={() => setDeleteConfirmId(delivery.id)}
                                                        title="Delete Delivery"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>

                {deliveries.links && deliveries.links.length > 3 && <Pagination data={deliveries} />}
            </div>

            <ActionConfirmDialog
                open={deleteConfirmId !== null}
                onCancel={() => setDeleteConfirmId(null)}
                onConfirm={() => {
                    if (deleteConfirmId) {
                        router.delete(route('admin.deliveries.destroy', deleteConfirmId), {
                            onSuccess: () => setDeleteConfirmId(null),
                        });
                    }
                }}
                title="Delete this delivery?"
                description="This will permanently remove the delivery and all related records (checklist, environment log, chain of custody). This cannot be undone."
                confirmText="Delete delivery"
                cancelText="Cancel"
                variant="destructive"
            />
        </AdminLayout>
    );
}
