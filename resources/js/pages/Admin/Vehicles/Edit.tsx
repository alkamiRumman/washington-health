import { ActionConfirmDialog } from '@/components/ActionConfirmDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/AdminLayout';
import { Vehicle } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export default function Edit({ vehicle }: { vehicle: Vehicle }) {
    const [deactivateOpen, setDeactivateOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        vehicle_number: vehicle.vehicle_number || '',
        description: vehicle.description || '',
        status: vehicle.status || 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('admin.vehicles.update', vehicle.id));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Vehicles', href: '/admin/vehicles' },
                { title: 'Edit Vehicle', href: `/admin/vehicles/${vehicle.id}/edit` },
            ]}
        >
            <Head title={`Edit Vehicle - ${vehicle.vehicle_number}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Edit Vehicle</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Updating registration and status for {vehicle.vehicle_number}</p>
                        </div>
                    </div>
                    <div className="flex w-full items-center gap-4 md:w-auto">
                        {vehicle.status !== 'inactive' && (
                            <Button variant="destructive" onClick={() => setDeactivateOpen(true)} className="w-full gap-2 md:w-auto">
                                <AlertCircle className="h-4 w-4" />
                                Deactivate Vehicle
                            </Button>
                        )}
                        <Button asChild className="w-full gap-2 md:w-auto">
                            <Link href={route('admin.vehicles.index')}>
                                <ChevronLeft className="h-5 w-5" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Vehicle Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_number">
                                            Vehicle Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="vehicle_number"
                                            value={data.vehicle_number}
                                            onChange={(e) => setData('vehicle_number', e.target.value)}
                                            required
                                        />
                                        {errors.vehicle_number && <p className="text-xs text-destructive">{errors.vehicle_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Operation Status</Label>
                                        <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                            <SelectTrigger id="status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="inactive">Inactive</SelectItem>
                                                <SelectItem value="maintenance">Maintenance</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.status && <p className="text-xs text-destructive">{errors.status}</p>}
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Fleet Description</Label>
                                        <Textarea
                                            id="description"
                                            rows={4}
                                            value={data.description || ''}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="resize-none"
                                            placeholder="Enter details about this vehicle..."
                                        />
                                        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Button type="button" variant="destructive" asChild>
                                        <Link href={route('admin.vehicles.index')}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Save Changes
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium tracking-wider text-muted-foreground uppercase">Registry Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase">Internal ID</Label>
                                    <p className="font-mono text-sm">#{vehicle.id}</p>
                                </div>
                                <div>
                                    <Label className="text-xs text-muted-foreground uppercase">Added On</Label>
                                    <p className="text-sm">{new Date(vehicle.created_at).toLocaleDateString()}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <ActionConfirmDialog
                open={deactivateOpen}
                onCancel={() => setDeactivateOpen(false)}
                onConfirm={() => {
                    router.delete(route('admin.vehicles.destroy', vehicle.id));
                    setDeactivateOpen(false);
                }}
                title="Deactivate this vehicle?"
                description="This will mark the vehicle as inactive and it will no longer be available for new deliveries."
                confirmText="Deactivate"
                cancelText="Cancel"
                variant="destructive"
            />
        </AdminLayout>
    );
}
