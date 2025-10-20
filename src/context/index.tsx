'use client'

import { saveToken } from '@/services/Token';
import useAuth from '@/services/useAuth';
import React, { createContext, useContext, useEffect, useState } from 'react'

interface User {
    idUser: string;
    name: string;
    email: string;
}

interface UserContext {
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
    isLoading: boolean;
}

const userContext = createContext<UserContext | undefined>(undefined);

export const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { refresh } = useAuth();

    const fetchToken = async () => {
        try {
            setIsLoading(true);
            const data = await refresh();
            const token = data?.data?.token;
            saveToken(token);
            setUser(data?.data?.infUser);
        } catch (error) {
            setUser(undefined);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchToken();
    }, [])

    const userState = {
        user,
        setUser,
        isLoading,
    }

    return (
        <userContext.Provider value={userState}>
            {children}
        </userContext.Provider>
    )
}

export const useUserContext = () => useContext(userContext);
