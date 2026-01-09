import { Metadata } from 'next';
import React from 'react'


export const metadata: Metadata = {
    title: "Strikes - Sign In",
};

const SignInLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>{children}</>
    )
}

export default SignInLayout