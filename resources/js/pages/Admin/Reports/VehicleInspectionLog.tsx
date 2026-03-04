import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { Delivery, User, Vehicle } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle2, ChevronLeft, Download, Eye, Filter, XCircle } from 'lucide-react';

interface Props {
    deliveries: Delivery[];
    drivers: User[];
    vehicles: Vehicle[];
    filters: {
        date_from: string;
        date_to: string;
        driver_id: string;
        vehicle_id: string;
    };
}

function BoolCell({ value }: { value: boolean | null | undefined }) {
    if (value === null || value === undefined) return <span className="text-gray-400">—</span>;
    return value ? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" /> : <XCircle className="mx-auto h-4 w-4 text-red-500" />;
}

export default function VehicleInspectionLog({ deliveries, drivers, vehicles, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        driver_id: filters.driver_id || '',
        vehicle_id: filters.vehicle_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('admin.reports.vehicle-log'), { preserveState: true });
    };

    const handleExport = () => {
        const query = new URLSearchParams();
        query.append('export', 'csv');
        if (data.date_from) query.append('date_from', data.date_from);
        if (data.date_to) query.append('date_to', data.date_to);
        if (data.driver_id) query.append('driver_id', data.driver_id);
        if (data.vehicle_id) query.append('vehicle_id', data.vehicle_id);

        window.location.href = `${route('admin.reports.vehicle-log')}?${query.toString()}`;
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reports', href: '/admin/reports' },
                { title: 'Vehicle Inspection Log', href: '/admin/reports/vehicle-inspection-log' },
            ]}
        >
            <Head title="Vehicle Cleaning & Inspection Log" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                            Daily Vehicle Cleaning & Inspection Log
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Pre-trip vehicle inspection checklist records — cleanliness, HVAC, cargo separation, contamination status, and driver
                            info.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300"
                        >
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                        <Button size="sm" asChild className="gap-2">
                            <Link href={route('admin.reports')}>
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="pt-0 shadow-sm">
                    <CardHeader className="border-b bg-indigo-100 py-4 dark:bg-indigo-900/50">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium">
                            <Filter className="h-4 w-4" />
                            Filter Log
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={submit} className="grid grid-cols-1 items-end gap-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-1.5">
                                <Label>Driver</Label>
                                <Select value={data.driver_id || 'all'} onValueChange={(v) => setData('driver_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger>
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
                                <Label>Vehicle</Label>
                                <Select value={data.vehicle_id || 'all'} onValueChange={(v) => setData('vehicle_id', v === 'all' ? '' : v)}>
                                    <SelectTrigger>
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
                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={processing} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-500">
                                    <Filter className="h-4 w-4" />
                                    Apply Filters
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                    <TableHead className="whitespace-nowrap">Date</TableHead>
                                    <TableHead className="whitespace-nowrap">Vehicle ID</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Vehicle Clean</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">HVAC Running</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Separation</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Logger Act</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Logs Comp</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Sealed</TableHead>
                                    <TableHead className="whitespace-nowrap">Driver</TableHead>
                                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                                            No vehicle inspection records found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    deliveries.map((d) => {
                                        const cl = d.checklist;
                                        return (
                                            <TableRow key={d.id} className="group transition-colors hover:cursor-pointer hover:bg-muted/50">
                                                <TableCell className="whitespace-nowrap">
                                                    {new Date(d.scheduled_time).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs font-semibold">
                                                    {d.vehicle?.vehicle_number || <span className="text-muted-foreground italic">N/A</span>}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <BoolCell value={cl?.vehicle_clean} />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <BoolCell value={cl?.hvac_running} />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <BoolCell value={cl?.separation_verified} />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <BoolCell value={cl?.logger_active} />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <BoolCell value={cl?.logs_completed} />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <BoolCell value={cl?.containers_sealed} />
                                                </TableCell>

                                                <TableCell className="font-medium">
                                                    {d.driver?.name || <span className="text-xs text-muted-foreground italic">Unassigned</span>}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-600">
                                                        <Link href={route('admin.deliveries.show', d.id)} title="View Details">
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {deliveries.length > 0 && (
                        <div className="border-t bg-muted/30 px-6 py-3">
                            <p className="text-xs text-muted-foreground">
                                Showing <span className="font-semibold text-foreground">{deliveries.length}</span> record
                                {deliveries.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
