'use client';

import { useUserContext } from '@/context';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
    const userContext = useUserContext();
    const router = useRouter();

    useEffect(() => {
        if (!userContext?.isLoading && !userContext?.user) {
            router.push('/auth');
        }
    }, [userContext?.isLoading, userContext?.user, router]);

    if (userContext?.isLoading) {
        return <Loader2 className="animate-spin mx-auto my-20" />;
    }

    if (!userContext?.user) {
        return null;
    }

    return <>{children}</>;
}

export default RequireAuth