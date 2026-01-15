import React from "react";

export const dynamic = 'force-dynamic';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
    );
}

export default AuthLayout;