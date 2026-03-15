import ChainOfCustodyForm from '@/components/ChainOfCustodyForm';
import DeliveryTimeline from '@/components/DeliveryTimeline';
import ElapsedTimer from '@/components/ElapsedTimer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import OfficerLayout from '@/layouts/OfficerLayout';
import { Delivery } from '@/types';
import { Head, Link } from '@inertiajs/react';

import { Calendar, ChevronLeft, MapPin, Truck, FileText } from 'lucide-react';

export default function DeliveryShow({ delivery }: { delivery: Delivery }) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <Badge variant="outline" className="border-yellow-200 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
                        PENDING
                    </Badge>
                );
            case 'assigned':
                return (
                    <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                        ASSIGNED
                    </Badge>
                );
            case 'in_progress':
                return (
                    <Badge variant="outline" className="border-purple-200 bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
                        IN PROGRESS
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge
                        variant="outline"
                        className="border-emerald-200 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                        COMPLETED
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status.toUpperCase()}</Badge>;
        }
    };

    return (
        <OfficerLayout
            breadcrumbs={[
                { title: 'My Deliveries', href: '/officer/deliveries' },
                { title: `Delivery #${delivery.id}`, href: '#' },
            ]}
        >
            <Head title={`Delivery #${delivery.id}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Delivery Details</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Viewing comprehensive information for delivery #{delivery.id}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {delivery.status === 'completed' && (
                            <Button variant="outline" size="sm" asChild className="gap-2">
                                <a href={route('compliance.export', delivery.id)} target="_blank" rel="noreferrer">
                                    <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                    Export PDF
                                </a>
                            </Button>
                        )}
                        <Button variant="outline" size="sm" asChild className="gap-2">
                            <Link href={route('officer.deliveries.index')}>
                                <ChevronLeft className="h-4 w-4" />
                                Back to List
                            </Link>
                        </Button>
                    </div>
                </div>

                <Card className="overflow-hidden pt-0 shadow-sm dark:border-gray-700">
                    <CardHeader className="border-b bg-indigo-100 py-4 dark:bg-indigo-900/50">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                                <Truck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                SHIPMENT INFO
                            </CardTitle>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(delivery.status)}
                                <span className="font-mono text-xs text-indigo-900/60 dark:text-indigo-200/60">ID: #{delivery.id}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div className="relative flex gap-4 rounded-xl border bg-indigo-50/20 p-4 dark:bg-indigo-900/10">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold tracking-wider text-indigo-500 uppercase">Pickup Location</p>
                                    <p className="mt-0.5 text-base leading-tight font-semibold text-gray-900 dark:text-white">
                                        {delivery.pickup_location}
                                    </p>
                                </div>
                            </div>

                            <div className="relative flex gap-4 rounded-xl border bg-emerald-50/20 p-4 dark:bg-emerald-900/10">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-bold tracking-wider text-emerald-500 uppercase">Delivery Location</p>
                                    <p className="mt-0.5 text-base leading-tight font-semibold text-gray-900 dark:text-white">
                                        {delivery.delivery_location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 rounded-lg border-t border-b bg-gray-50/50 p-3 text-sm dark:border-gray-700 dark:bg-gray-800/30">
                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <Calendar className="h-4 w-4 text-indigo-500" />
                                <span className="font-medium">Scheduled:</span>
                                <span className="text-gray-900 dark:text-white">
                                    {new Date(delivery.scheduled_time).toLocaleString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                    })}
                                </span>
                            </div>

                            {delivery.vehicle && (
                                <div className="flex items-center gap-2 border-l pl-6 text-gray-600 dark:border-gray-700 dark:text-gray-400">
                                    <Truck className="h-4 w-4 text-indigo-500" />
                                    <span className="font-medium">Vehicle:</span>
                                    <span className="rounded border bg-white px-2 py-0.5 font-mono text-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:text-white">
                                        {delivery.vehicle.vehicle_number}
                                    </span>
                                </div>
                            )}

                            {delivery.status === 'in_progress' && delivery.start_time && (
                                <div className="flex items-center gap-2 border-l pl-6 text-indigo-600 dark:border-gray-700 dark:text-indigo-400">
                                    <span className="text-xs font-bold uppercase">ELAPSED:</span>
                                    <ElapsedTimer startTime={delivery.start_time} />
                                </div>
                            )}

                            {delivery.status === 'completed' && delivery.duration_minutes != null && (
                                <div className="flex items-center gap-2 border-l pl-6 text-emerald-600 dark:border-gray-700 dark:text-emerald-400">
                                    <Badge variant="outline" className="border-emerald-100 bg-emerald-50 font-bold text-emerald-700">
                                        COMPLETED IN {delivery.duration_minutes} MINS
                                    </Badge>
                                </div>
                            )}
                        </div>

                        {/* Read-only operational records */}
                        {delivery.checklist && (
                            <div className="mt-4 rounded-lg border bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-900/40">
                                <h3 className="mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                                    Pre-trip checklist
                                </h3>
                                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                                    <li>
                                        <span className="text-gray-500 dark:text-gray-400">Vehicle clean: </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.checklist.vehicle_clean ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 dark:text-gray-400">HVAC running: </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.checklist.hvac_running ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 dark:text-gray-400">Logger active: </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.checklist.logger_active ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 dark:text-gray-400">Separation verified: </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.checklist.separation_verified ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 dark:text-gray-400">Containers sealed: </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.checklist.containers_sealed ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 dark:text-gray-400">Logs completed: </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.checklist.logs_completed ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 dark:text-gray-400">Chain of custody signed: </span>
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.checklist.chain_of_custody_signed ? 'Yes' : 'No'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {/* Chain of Custody Form with Signature Pad */}
                        <div className="mt-4">
                            <ChainOfCustodyForm 
                                delivery={delivery} 
                                coc={delivery.chain_of_custody || undefined} 
                                readOnly={delivery.status === 'completed'} 
                            />
                        </div>

                        {delivery.environment_log && (
                            <div className="mt-4 rounded-lg border bg-white p-4 text-sm dark:border-gray-700 dark:bg-gray-900/40">
                                <h3 className="mb-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400 uppercase">
                                    Temperature &amp; humidity
                                </h3>
                                <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                                    <div>
                                        <dt className="text-xs text-gray-500 dark:text-gray-400">Start</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.environment_log.start_temp ?? '—'}°F /{' '}
                                            {delivery.environment_log.start_humidity ?? '—'}%
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-gray-500 dark:text-gray-400">Mid-route</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.environment_log.mid_temp ?? '—'}°F /{' '}
                                            {delivery.environment_log.mid_humidity ?? '—'}%
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-gray-500 dark:text-gray-400">End</dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {delivery.environment_log.end_temp ?? '—'}°F /{' '}
                                            {delivery.environment_log.end_humidity ?? '—'}%
                                        </dd>
                                    </div>
                                </dl>
                                {delivery.environment_log.corrective_action && (
                                    <div className="mt-2 border-t border-gray-100 pt-2 text-xs dark:border-gray-700">
                                        <span className="font-semibold text-gray-700 dark:text-gray-200">Corrective action: </span>
                                        <span className="text-gray-700 dark:text-gray-200">
                                            {delivery.environment_log.corrective_action}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-4 rounded-lg border p-4 dark:border-gray-700">
                            <h3 className="mb-4 flex items-center gap-2 text-base font-bold tracking-tight text-gray-900 uppercase dark:text-gray-100">
                                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                Delivery Timeline
                            </h3>
                            <DeliveryTimeline delivery={delivery} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </OfficerLayout>
    );
}

