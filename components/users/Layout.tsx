import React, { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="p-4">
            <div className="container">
                {children}
            </div>
        </div>
    );
}