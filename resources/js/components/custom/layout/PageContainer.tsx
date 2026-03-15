import React, { ReactNode } from 'react';

interface PageContainerProps {
    title: string;
    children: ReactNode;
    actions?: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children, actions }) => {
    return (
        <div className="animate-fade-in container mx-auto px-4 py-4">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <h1 className="mb-3 text-2xl font-bold text-gray-800 md:mb-0">{title}</h1>
                {actions && <div className="flex space-x-2">{actions}</div>}
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">{children}</div>
        </div>
    );
};

export default PageContainer;
