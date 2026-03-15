import { Pagination } from '@/components/custom/Pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import OfficerLayout from '@/layouts/OfficerLayout';
import { PaginatedData, QualityReport, User } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ClipboardCheck, Eye, Search } from 'lucide-react';
import { useState } from 'react';

interface Props {
    reports: PaginatedData<QualityReport>;
    filters: { month_year: string };
}

export default function Index({ reports, filters }: Props) {
    const { auth } = usePage().props as unknown as { auth: { user: User } };
    const isAdmin = auth.user.role === 'admin' || auth.user.role === 'super_admin';
    const Layout = isAdmin ? AdminLayout : OfficerLayout;

    const [monthYear, setMonthYear] = useState(filters.month_year || '');
    const [viewReport, setViewReport] = useState<QualityReport | null>(null);

    const routeName = isAdmin ? 'admin.my-quality-reports' : 'officer.quality-reports.index';

    const applyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route(routeName), { month_year: monthYear || undefined }, { preserveState: true });
    };

    const resetFilters = () => {
        setMonthYear('');
        router.get(route(routeName), {}, { preserveState: false });
    };

    return (
        <Layout 
            breadcrumbs={isAdmin ? [
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Quality Reports', href: '/admin/quality-reports' }
            ] : [
                { title: 'Dashboard', href: '/officer/dashboard' },
                { title: 'Quality Reports', href: '/officer/quality-reports' }
            ]}>
            <Head title="Quality Reports" />
            <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-x-hidden p-4 lg:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">My Supervisor Reviews</h1>
                        <p className="text-sm text-muted-foreground">Monthly supervisor reviews and quality reports created by you.</p>
                    </div>
                </div>

                <div className="rounded-lg border bg-muted/30 px-3 py-2 dark:border-gray-700 dark:bg-gray-800/50">
                    <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-2">
                        <div className="w-36">
                            <Label className="text-[10px] font-medium text-muted-foreground">Month / Year</Label>
                            <Input
                                type="month"
                                value={monthYear}
                                onChange={(e) => setMonthYear(e.target.value)}
                                className="h-8 text-xs"
                            />
                        </div>
                        <Button type="submit" size="sm" className="h-8 gap-1 px-3 text-xs">
                            <Search className="h-3.5 w-3.5" />
                            Search
                        </Button>
                        <Button type="button" size="sm" variant="outline" className="h-8 px-3 text-xs" onClick={resetFilters}>
                            Reset
                        </Button>
                    </form>
                </div>

                <div className="min-w-0 overflow-hidden rounded-xl border bg-white text-xs shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    {/* Mobile: compact cards */}
                    <div className="space-y-2 p-3 sm:hidden">
                        {reports.data.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">No targeted quality reports found.</p>
                        ) : (
                            reports.data.map((report) => (
                                <div
                                    key={report.id}
                                    className="rounded-lg border bg-muted/30 p-3 dark:border-gray-700 dark:bg-gray-800/50"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">{report.month_year}</span>
                                        <span className="truncate text-muted-foreground">{report.supervisor_name || '—'}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {report.vehicle?.vehicle_number ?? report.vehicle_ids ?? '—'}
                                        {report.delivery_id && (
                                            <>
                                                {' · '}
                                                <Link href={isAdmin ? route('admin.deliveries.show', report.delivery_id) : route('officer.deliveries.show', report.delivery_id)} className="font-medium text-indigo-600 hover:underline">
                                                    #{report.delivery_id}
                                                </Link>
                                            </>
                                        )}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 gap-1 text-xs"
                                            onClick={() => setViewReport(report)}
                                        >
                                            <Eye className="h-3.5 w-3.5" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* Tablet/Desktop: table */}
                    <div className="hidden overflow-x-auto sm:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/50 dark:hover:bg-indigo-900/50">
                                    <TableHead className="h-9 px-3 py-2 font-medium">Month / Year</TableHead>
                                    <TableHead className="h-9 px-3 py-2 font-medium">Vehicle</TableHead>
                                    <TableHead className="h-9 px-3 py-2 font-medium">Delivery ID</TableHead>
                                    <TableHead className="h-9 max-w-[140px] px-3 py-2 font-medium">Issues found</TableHead>
                                    <TableHead className="h-9 max-w-[140px] px-3 py-2 font-medium">Actions taken</TableHead>
                                    <TableHead className="h-9 px-3 py-2 text-right font-medium">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-14 px-3 py-2 text-center text-muted-foreground">
                                            No targeted quality reports found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.data.map((report) => (
                                        <TableRow key={report.id} className="hover:bg-muted/50">
                                            <TableCell className="px-3 py-2 font-medium">{report.month_year}</TableCell>
                                            <TableCell className="px-3 py-2">{report.vehicle?.vehicle_number ?? report.vehicle_ids ?? '—'}</TableCell>
                                            <TableCell className="px-3 py-2">
                                                {report.delivery_id ? (
                                                    <Link href={isAdmin ? route('admin.deliveries.show', report.delivery_id) : route('officer.deliveries.show', report.delivery_id)} className="text-indigo-600 hover:underline">
                                                        #{report.delivery_id}
                                                    </Link>
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-[140px] truncate px-3 py-2 text-muted-foreground" title={report.environmental_excursions || ''}>
                                                {report.environmental_excursions || '—'}
                                            </TableCell>
                                            <TableCell className="max-w-[140px] truncate px-3 py-2 text-muted-foreground" title={report.corrective_actions || ''}>
                                                {report.corrective_actions || '—'}
                                            </TableCell>
                                            <TableCell className="px-3 py-2 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-blue-600"
                                                        onClick={() => setViewReport(report)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                        <span className="sr-only">View</span>
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {reports.links && reports.links.length > 3 && <Pagination data={reports} />}
            </div>

            <Dialog open={!!viewReport} onOpenChange={(open) => !open && setViewReport(null)}>
                <DialogContent className="max-h-[85vh] overflow-y-auto">
                    {viewReport && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <ClipboardCheck className="h-4 w-4" />
                                    Quality Report — {viewReport.month_year}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium">Supervisor:</span> {viewReport.supervisor_name || '—'}</p>
                                <p><span className="font-medium">Vehicle(s):</span> {viewReport.vehicle_ids || viewReport.vehicle?.vehicle_number || '—'}</p>
                                <p><span className="font-medium">Delivery:</span> {viewReport.delivery_id ? `#${viewReport.delivery_id}` : '—'}</p>
                                <p><span className="font-medium">Transport days reviewed:</span> {viewReport.transport_days_reviewed || '—'}</p>
                                <p><span className="font-medium">Environmental excursions:</span> {viewReport.environmental_excursions || '—'}</p>
                                <p><span className="font-medium">Corrective actions:</span> {viewReport.corrective_actions || '—'}</p>
                                <p><span className="font-medium">Training issues:</span> {viewReport.training_issues || '—'}</p>
                                <p><span className="font-medium">Preventive improvements:</span> {viewReport.preventive_improvements || '—'}</p>
                                <p><span className="font-medium">Signature / Date:</span> {viewReport.signature_date || '—'}</p>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
