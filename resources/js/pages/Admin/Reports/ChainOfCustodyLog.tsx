import { Badge } from '@/components/ui/badge';
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

export default function ChainOfCustodyLog({ deliveries, drivers, vehicles, filters }: Props) {
    const { data, setData, get, processing } = useForm({
        date_from: filters.date_from || '',
        date_to: filters.date_to || '',
        driver_id: filters.driver_id || '',
        vehicle_id: filters.vehicle_id || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        get(route('admin.reports.coc-log'), { preserveState: true });
    };

    const handleExport = () => {
        const query = new URLSearchParams();
        query.append('export', 'csv');
        if (data.date_from) query.append('date_from', data.date_from);
        if (data.date_to) query.append('date_to', data.date_to);
        if (data.driver_id) query.append('driver_id', data.driver_id);
        if (data.vehicle_id) query.append('vehicle_id', data.vehicle_id);

        window.location.href = `${route('admin.reports.coc-log')}?${query.toString()}`;
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reports', href: '/admin/reports' },
                { title: 'Chain-of-Custody Log', href: '/admin/reports/chain-of-custody-log' },
            ]}
        >
            <Head title="Instrument Chain-of-Custody Log" />
            <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Instrument Chain-of-Custody Log</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Records of container transfers — pickup department, delivery department, condition, seal status, and driver signature.
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
                    <CardContent>
                        <form onSubmit={submit} className="grid grid-cols-1 items-end gap-4 text-sm sm:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-1">
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
                            <div className="space-y-1">
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
                            <div className="flex items-center gap-2 lg:col-span-1">
                                <Button type="submit" disabled={processing} className="w-full gap-2 bg-indigo-600 hover:bg-indigo-500">
                                    <Filter className="h-4 w-4" />
                                    Apply Filters
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="min-w-0 overflow-hidden rounded-xl border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    {/* Tablet/Desktop: table */}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                    <TableHead className="whitespace-nowrap">Date</TableHead>
                                    <TableHead className="whitespace-nowrap">Time Out</TableHead>
                                    <TableHead className="whitespace-nowrap">From Dept</TableHead>
                                    <TableHead className="whitespace-nowrap">To Dept</TableHead>
                                    <TableHead className="whitespace-nowrap">Container ID</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Clean / Soiled</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Seal Status</TableHead>
                                    <TableHead className="whitespace-nowrap">Condition</TableHead>
                                    <TableHead className="whitespace-nowrap">Driver</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Driver Sig</TableHead>
                                    <TableHead className="text-center whitespace-nowrap">Receiver Sig</TableHead>
                                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deliveries.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={12} className="h-24 px-3 py-2 text-center text-muted-foreground">
                                            No chain-of-custody records found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    deliveries.map((d) => {
                                        const coc = d.chain_of_custody;
                                        return (
                                            <TableRow key={d.id} className="group transition-colors hover:cursor-pointer hover:bg-muted/50">
                                                <TableCell className="whitespace-nowrap px-3 py-2">
                                                    {new Date(d.scheduled_time).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs whitespace-nowrap px-3 py-2 text-muted-foreground">
                                                    {coc?.pickup_time
                                                        ? new Date(coc.pickup_time).toLocaleTimeString('en-US', {
                                                              hour: 'numeric',
                                                              minute: '2-digit',
                                                          })
                                                        : '—'}
                                                </TableCell>
                                                <TableCell className="max-w-[140px] truncate px-3 py-2" title={coc?.pickup_department || ''}>
                                                    {coc?.pickup_department || <span className="text-muted-foreground italic">—</span>}
                                                </TableCell>
                                                <TableCell className="max-w-[140px] truncate px-3 py-2" title={coc?.delivery_department || ''}>
                                                    {coc?.delivery_department || <span className="text-muted-foreground italic">—</span>}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs px-3 py-2 text-muted-foreground">{coc?.container_ids || '—'}</TableCell>
                                                <TableCell className="px-3 py-2 text-center">
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] font-bold uppercase ${coc?.condition === 'clean' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' : coc?.condition ? 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-gray-100 text-gray-500'}`}
                                                    >
                                                        {coc?.condition ? coc.condition : '—'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-center">
                                                    <BoolCell value={!!coc?.driver_signature} />
                                                </TableCell>
                                                <TableCell className="text-xs capitalize text-muted-foreground px-3 py-2">{coc?.condition || '—'}</TableCell>
                                                <TableCell className="px-3 py-2 font-medium">
                                                    {d.driver?.name || <span className="text-xs text-muted-foreground italic">Unassigned</span>}
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-center">
                                                    <BoolCell value={!!coc?.driver_signature} />
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-center">
                                                    <BoolCell value={!!coc?.receiver_signature} />
                                                </TableCell>
                                                <TableCell className="px-3 py-2 text-right">
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
                        <div className="border-t bg-muted/30 px-4 py-2">
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
