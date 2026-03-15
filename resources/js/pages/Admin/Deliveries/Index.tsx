import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import { AdminDeliveryCard } from '@/components/custom/deliveries/AdminDeliveryCard';
import { Pagination } from '@/components/custom/Pagination';
import { QualityReviewForm } from '@/components/QualityReviewForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { Delivery, PaginatedData, User, Vehicle } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Calendar as CalendarIcon, ClipboardCheck, Download, Eye, FileText, Filter, RotateCcw, Shuffle, Trash2, Truck, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface DeliveriesProps {
    deliveries: PaginatedData<Delivery>;
    drivers: User[];
    vehicles: Vehicle[];
    filters: {
        id: string;
        status: string;
        driver_id: string;
        vehicle_id: string;
        date_from: string;
        date_to: string;
    };
}

export default function Index({ deliveries, drivers, vehicles, filters }: DeliveriesProps) {
    const { auth } = usePage().props as unknown as { auth: { user?: { name?: string } } };
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [reviewDeliveryId, setReviewDeliveryId] = useState<number | null>(null);
    const [reviewVehicleId, setReviewVehicleId] = useState<number | null>(null);
    const [reviewVehicleIds, setReviewVehicleIds] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false);
    const { data, setData, get, processing } = useForm({
        id: filters.id || '',
        status: filters.status || '',
        driver_id: filters.driver_id || '',
        vehicle_id: filters.vehicle_id || '',
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
    });

    const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== null && v !== undefined).length;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (window.innerWidth < 640) setShowFilters(false);
        get(route('admin.deliveries'), { preserveState: true, preserveScroll: true });
    };

    const handleFilterSelect = (key: string, val: any) => {
        setData(key as any, val);
        const newData = { ...data, [key]: val };
        if (window.innerWidth < 640) setShowFilters(false);
        router.get(route('admin.deliveries'), newData as any, { preserveState: true, preserveScroll: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (data.id) params.set('id', data.id);
        if (data.status) params.set('status', data.status);
        if (data.driver_id) params.set('driver_id', data.driver_id);
        if (data.vehicle_id) params.set('vehicle_id', data.vehicle_id);
        if (data.date_from) params.set('date_from', data.date_from);
        if (data.date_to) params.set('date_to', data.date_to);
        window.open(route('admin.deliveries.export') + (params.toString() ? '?' + params.toString() : ''), '_blank');
    };

    const handleReset = () => {
        setData({
            id: '',
            status: '',
            driver_id: '',
            vehicle_id: '',
            date_from: '',
            date_to: '',
        });
        if (window.innerWidth < 640) setShowFilters(false);
        router.get(route('admin.deliveries'), {}, { preserveState: false });
    };

    const handleReviewRandom = async () => {
        const res = await fetch(route('admin.quality-reports.random-delivery'));
        const json = (await res.json()) as { id: number | null; vehicle_id?: number | null };
        if (json.id) {
            setReviewDeliveryId(json.id);
            setReviewVehicleId(json.vehicle_id ?? null);
            setReviewVehicleIds(null);
            setReviewOpen(true);
        }
    };

    const openReviewForDelivery = (delivery: Delivery) => {
        setReviewDeliveryId(delivery.id);
        setReviewVehicleId(delivery.vehicle_id ?? null);
        setReviewVehicleIds(delivery.vehicle?.vehicle_number ?? null);
        setReviewOpen(true);
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
            <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Deliveries Management</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Monitor fleet operations and track service compliance.</p>
                    </div>
                    <div className="flex w-full flex-wrap gap-2 md:w-auto">
                        <Button variant="outline" size="sm" onClick={handleReviewRandom} className="gap-1.5 text-xs">
                            <Shuffle className="h-3.5 w-3.5" />
                            Review Random Delivery
                        </Button>
                        <Button variant="outline" onClick={handleExport} className="gap-2">
                            <Download className="h-4 w-4" />
                            Export Data
                        </Button>
                    </div>
                </div>

                {/* Compact inline filters */}
                <div className="rounded-lg border bg-muted/30 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50">
                    <div className="mb-2 w-full sm:hidden">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                            {activeFiltersCount > 0 && !showFilters && (
                                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-[10px]">
                                    {activeFiltersCount} Active
                                </Badge>
                            )}
                        </Button>
                    </div>
                    <form onSubmit={submit} className={`flex-col gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-end w-full ${showFilters ? 'flex' : 'hidden'}`}>
                        <div className="flex flex-1 flex-wrap items-end gap-2">
                            <div>
                                <Label htmlFor="filter-id" className="text-[10px] font-medium text-muted-foreground">ID</Label>
                                <Input
                                    id="filter-id"
                                    type="text"
                                    placeholder="#"
                                    value={data.id}
                                    onChange={(e) => setData('id', e.target.value)}
                                    className="h-8 text-xs w-[80px]"
                                />
                            </div>
                            <div>
                                <Label htmlFor="filter-status" className="text-[10px] font-medium text-muted-foreground">Status</Label>
                                <Select value={data.status || 'all'} onValueChange={(v) => handleFilterSelect('status', v === 'all' ? '' : v)}>
                                    <SelectTrigger id="filter-status" className="h-8 text-xs w-[120px]">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="assigned">Assigned</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="filter-driver" className="text-[10px] font-medium text-muted-foreground">Driver</Label>
                                <Select value={data.driver_id || 'all'} onValueChange={(v) => handleFilterSelect('driver_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger id="filter-driver" className="h-8 text-xs w-[120px]">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {drivers.map((d) => (
                                            <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="filter-vehicle" className="text-[10px] font-medium text-muted-foreground">Vehicle</Label>
                                <Select value={data.vehicle_id || 'all'} onValueChange={(v) => handleFilterSelect('vehicle_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger id="filter-vehicle" className="h-8 text-xs w-[120px]">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {vehicles.map((v) => (
                                            <SelectItem key={v.id} value={String(v.id)}>{v.vehicle_number}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="text-[10px] font-medium text-muted-foreground">From</Label>
                                <DatePicker value={data.date_from} onChange={(v) => handleFilterSelect('date_from', v)} placeholder="Date" className="h-8 w-48" />
                            </div>
                            <div>
                                <Label className="text-[10px] font-medium text-muted-foreground">To</Label>
                                <DatePicker value={data.date_to} onChange={(v) => handleFilterSelect('date_to', v)} placeholder="Date" className="h-8 w-48" />
                            </div>
                        </div>
                        <div className="flex gap-1.5">
                            <Button type="button" size="sm" variant="outline" className="h-8 gap-1 px-3 text-xs" onClick={handleReset}>
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Mobile: card list */}
                <div className="space-y-3 md:hidden">
                    {deliveries.data.length === 0 ? (
                        <div className="rounded-xl border bg-white p-6 text-center text-muted-foreground dark:border-gray-700 dark:bg-gray-800">
                            No deliveries found matching your search.
                        </div>
                    ) : (
                        deliveries.data.map((delivery) => {
                            const status = statusConfig[delivery.status] || { label: delivery.status, color: '' };
                            return (
                                <AdminDeliveryCard
                                    key={delivery.id}
                                    delivery={delivery}
                                    statusLabel={status.label}
                                    statusClassName={status.color}
                                    onDelete={setDeleteConfirmId}
                                    onReview={openReviewForDelivery}
                                />
                            );
                        })
                    )}
                </div>

                {/* Tablet/Desktop: compact table */}
                <div className="hidden overflow-hidden rounded-xl border bg-white text-xs shadow-sm dark:border-gray-700 dark:bg-gray-800 md:block">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                <TableHead className="h-9 w-[70px] px-3 py-2 font-medium">ID</TableHead>
                                <TableHead className="h-9 px-3 py-2 font-medium">Schedule</TableHead>
                                <TableHead className="h-9 px-3 py-2 font-medium">Route</TableHead>
                                <TableHead className="h-9 px-3 py-2 font-medium">Assignees</TableHead>
                                <TableHead className="h-9 px-3 py-2 font-medium">Status</TableHead>
                                <TableHead className="h-9 px-3 py-2 text-right font-medium">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deliveries.data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-20 px-3 py-2 text-center text-muted-foreground">
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
                                            <TableCell className="px-3 py-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                                #{delivery.id}
                                            </TableCell>
                                            <TableCell className="px-3 py-2">
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
                                            <TableCell className="px-3 py-2">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
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
                                            <TableCell className="px-3 py-2">
                                                <Badge
                                                    variant="outline"
                                                    className={`border px-2.5 py-0.5 text-[10px] font-bold tracking-wider whitespace-nowrap uppercase ${status.color}`}
                                                >
                                                    {status.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-indigo-600 hover:text-indigo-700"
                                                        title="Review Delivery"
                                                        onClick={() => openReviewForDelivery(delivery)}
                                                    >
                                                        <ClipboardCheck className="h-4 w-4" />
                                                    </Button>
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

                {deliveries.links && deliveries.links.length > 3 && (
                    <div className="flex flex-wrap justify-center gap-2 pt-4">
                        <Pagination data={deliveries} />
                    </div>
                )}
            </div>

            <Sheet open={reviewOpen} onOpenChange={(open) => { setReviewOpen(open); if (!open) { setReviewDeliveryId(null); setReviewVehicleId(null); setReviewVehicleIds(null); } }}>
                <SheetContent side="left" className="flex w-[85vw] max-w-lg flex-col overflow-y-auto p-0 sm:max-w-lg">
                    <SheetHeader className="shrink-0 border-b px-4 py-3">
                        <SheetTitle className="flex items-center gap-2">
                            <ClipboardCheck className="h-4 w-4" />
                            Delivery Quality Review
                        </SheetTitle>
                    </SheetHeader>
                    <div className="flex-1 overflow-y-auto p-4">
                        <QualityReviewForm
                            key={`${reviewDeliveryId ?? 0}-${reviewVehicleId ?? 0}`}
                            submitRoute={route('admin.quality-reports.store')}
                            initialDeliveryId={reviewDeliveryId}
                            initialVehicleId={reviewVehicleId}
                            initialVehicleIds={reviewVehicleIds ?? undefined}
                            initialSupervisorName={auth.user?.name ?? undefined}
                            onSuccess={() => { setReviewOpen(false); setReviewDeliveryId(null); setReviewVehicleId(null); setReviewVehicleIds(null); }}
                        />
                    </div>
                </SheetContent>
            </Sheet>

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
