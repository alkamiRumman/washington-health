import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Truck } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        vehicle_number: '',
        description: '',
        status: 'active',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.vehicles.store'));
    };

    return (
        <AdminLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/admin/dashboard' },
                { title: 'Vehicles', href: '/admin/vehicles' },
                { title: 'Add Vehicle', href: '/admin/vehicles/create' },
            ]}
        >
            <Head title="Add Vehicle" />
            <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full">
                        <Link href={route('admin.vehicles.index')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Add New Vehicle</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Register a new vehicle to the fleet inventory.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <Card className="shadow-sm lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Vehicle Registration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="vehicle_number">
                                            Vehicle Number <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="vehicle_number"
                                            value={data.vehicle_number}
                                            onChange={(e) => setData('vehicle_number', e.target.value)}
                                            placeholder="e.g. VH-101"
                                            required
                                        />
                                        {errors.vehicle_number && <p className="text-xs text-destructive">{errors.vehicle_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Initial Status</Label>
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
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="resize-none"
                                            placeholder="Describe the vehicle's purpose or characteristics..."
                                        />
                                        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 border-t pt-6">
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={route('admin.vehicles.index')}>Cancel</Link>
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        Register Vehicle
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="hidden lg:block">
                        <Card className="border-indigo-100 bg-indigo-50 shadow-none dark:border-indigo-800 dark:bg-indigo-900/20">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <Truck className="h-5 w-5" />
                                    <CardTitle className="text-sm font-bold tracking-wide uppercase">Fleet Tips</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-indigo-700 dark:text-indigo-300">
                                <p>Ensure vehicle numbers match your internal asset tracking codes for consistency.</p>
                                <p>Refrigerated or specialized vehicles should have that noted in the description for easy assignment.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
