'use client';
import { getSession } from '@/authentication/lib';
import React, { useEffect, useState } from 'react';
import Title1 from '../elements/Title1';
import { Loader2, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function TopBar() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const [showBar, setShowBar] = useState(true);

    useEffect(() => {
        async function fetchDataUser() {
            try {
                setLoading(true);
                const session = await getSession();
                if (session) {
                    setUser(session?.user?.payload);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
        fetchDataUser();
    }, []);

    useEffect(() => {
        if (!user) return;
        const hiddenRoutesForJunior = ['/dashboard/contracts', '/dashboard/clientes'];

        if (user.role === 'junior' && hiddenRoutesForJunior.includes(pathname)) {
            setShowBar(false);
        } else {
            setShowBar(true);
        }
    }, [pathname, user]);

    return (
        <nav className={cn('w-full h-24 px-6 flex shadow flex-row justify-between items-center p-4', !showBar ? '' : 'hidden')}>
            <div>
                <Title1 className='text-2xl'>
                    {loading ? 'Cargando...' : user ? `Bienvenido ${user?.role}` : 'Bienvenido'}
                </Title1>
            </div>
            <div>
                <section className='p-4 rounded-xl flex flex-row items-center gap-4 border border-gray-500 hover:bg-gray-100'>
                    <User /> {loading ? <Loader2 className='animate-spin' /> : <p>{user?.sub}</p>}
                </section>
            </div>
        </nav>
    );
};