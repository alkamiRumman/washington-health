import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { type ReactNode, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function OfficerLayout({ children, breadcrumbs }: { children: ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { props: pageProps } = usePage() as any;
    const flashMessage = pageProps?.flash?.message;
    const success = flashMessage?.success;
    const errorMsg = flashMessage?.error;

    useEffect(() => {
        if (success) toast.success(success);
        if (errorMsg) toast.error(errorMsg);
    }, [success, errorMsg]);

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>
                <ToastContainer position="bottom-right" autoClose={3000} />
                {children}
            </AppContent>
        </AppShell>
    );
}
