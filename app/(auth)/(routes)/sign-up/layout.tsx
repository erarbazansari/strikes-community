import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
    title: "Strikes - Register",
};

const SignUpLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default SignUpLayout