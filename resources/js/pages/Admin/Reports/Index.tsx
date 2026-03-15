import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { ReportProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Car, CheckCircle, ClipboardCheck, ClipboardList, Clock, Package, ShieldCheck, Truck } from 'lucide-react';
import { Cell, Legend, Pie, PieChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export default function Index({
    totalDeliveries,
    completedDeliveries,
    pendingDeliveries,
    inProgressDeliveries,
    deliveriesByDriver,
    recentCompleted,
}: ReportProps) {
    const statusData = [
        { name: 'Completed', value: completedDeliveries, color: '#10b981' },
        { name: 'In Progress', value: inProgressDeliveries, color: '#8b5cf6' },
        { name: 'Pending', value: pendingDeliveries, color: '#f59e0b' },
    ].filter((v) => v.value > 0);

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Reports', href: '/admin/reports' },
            ]}
        >
            <Head title="System Reports" />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">System Reports</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Overview of delivery system statistics, driver performance, and compliance logs.
                        </p>
                    </div>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-md bg-indigo-50 p-3 dark:bg-indigo-900/50">
                                <Package className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Deliveries</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalDeliveries}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-md bg-green-50 p-3 dark:bg-green-900/50">
                                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedDeliveries}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-md bg-purple-50 p-3 dark:bg-purple-900/50">
                                <Truck className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{inProgressDeliveries}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/50">
                                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{pendingDeliveries}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Log Reports */}
                <div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Link
                            href={route('admin.reports.coc-log')}
                            className="group flex items-start gap-4 rounded-xl border bg-gray-100 p-5 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-500"
                        >
                            <div className="flex-shrink-0 rounded-lg bg-indigo-50 p-3 transition-colors group-hover:bg-indigo-100 dark:bg-indigo-900/40 dark:group-hover:bg-indigo-900/60">
                                <ClipboardList className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 transition-colors group-hover:text-indigo-700 dark:text-gray-100 dark:group-hover:text-indigo-300">
                                    Instrument Chain-of-Custody Log
                                </p>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    Container transfers, department records, seal status & driver/receiver signatures. Filter by date range or driver.
                                </p>
                            </div>
                        </Link>
                        <Link
                            href={route('admin.reports.vehicle-log')}
                            className="group flex items-start gap-4 rounded-xl border bg-gray-100 p-5 shadow-sm transition-all hover:border-emerald-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-500"
                        >
                            <div className="flex-shrink-0 rounded-lg bg-emerald-50 p-3 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-900/40 dark:group-hover:bg-emerald-900/60">
                                <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-gray-100 dark:group-hover:text-emerald-300">
                                    Daily Vehicle Cleaning & Inspection Log
                                </p>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    Pre-trip checklist records — vehicle cleanliness, PPE, cargo separation & contamination status.
                                </p>
                            </div>
                        </Link>
                        <Link
                            href={route('admin.quality-reports.index')}
                            className="group flex items-start gap-4 rounded-xl border bg-gray-100 p-5 shadow-sm transition-all hover:border-yellow-400 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-yellow-500"
                        >
                            <div className="flex-shrink-0 rounded-lg bg-yellow-50 p-3 transition-colors group-hover:bg-yellow-100 dark:bg-yellow-900/40 dark:group-hover:bg-yellow-900/60">
                                <ClipboardCheck className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 transition-colors group-hover:text-yellow-700 dark:text-gray-100 dark:group-hover:text-yellow-300">
                                    Quality Reports
                                </p>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                    Quality reports for vehicles and deliveries. Filter by date range or driver.
                                </p>
                            </div>
                        </Link>
                        
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* Charts */}
                    <div className="flex h-[450px] flex-col items-center rounded-xl border bg-gray-100 p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 w-full text-lg font-semibold text-gray-900 dark:text-gray-100">Delivery Status Distribution</h2>
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-1 items-center justify-center text-gray-500">No data available</div>
                        )}
                    </div>

                    {/* Top Drivers */}
                    <div className="flex h-[450px] flex-col overflow-hidden rounded-xl border bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div className="border-b px-4 py-3 dark:border-gray-700">
                            <h2 className="flex items-center gap-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                <Car className="h-5 w-5 text-gray-400" />
                                Top Drivers by Deliveries
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0">
                            <Table>
                                <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/40">
                                    <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                        <TableHead>Driver Name</TableHead>
                                        <TableHead className="text-right">Completed Deliveries</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {deliveriesByDriver.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                                                No drivers found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        deliveriesByDriver.map((driver) => (
                                            <TableRow key={driver.id} className="transition-colors hover:bg-muted/50">
                                                <TableCell className="font-medium">{driver.name}</TableCell>

                                                <TableCell className="text-right font-semibold text-primary">
                                                    {driver.deliveries_as_driver_count}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>

                {/* Recent Completed Deliveries */}
                <div className="overflow-hidden rounded-xl border bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b px-4 py-3 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recently Completed</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                    <TableHead>ID</TableHead>
                                    <TableHead>Route</TableHead>
                                    <TableHead>Driver</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {recentCompleted.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No completed deliveries found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentCompleted.map((delivery) => (
                                        <TableRow key={delivery.id} className="transition-colors hover:bg-muted/50">
                                            {/* ID */}
                                            <TableCell className="font-medium">#{delivery.id}</TableCell>

                                            {/* Route */}
                                            <TableCell className="max-w-xs truncate text-muted-foreground">
                                                {delivery.pickup_location} → {delivery.delivery_location}
                                            </TableCell>

                                            {/* Driver */}
                                            <TableCell className="text-muted-foreground">{delivery.driver?.name ?? 'Unknown'}</TableCell>

                                            {/* End Time */}
                                            <TableCell className="text-muted-foreground">{new Date(delivery.end_time).toLocaleString()}</TableCell>

                                            {/* Action */}
                                            <TableCell className="text-right">
                                                <Button asChild variant="link" className="px-0">
                                                    <Link href={`/admin/deliveries/${delivery.id}`}>View Details</Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
