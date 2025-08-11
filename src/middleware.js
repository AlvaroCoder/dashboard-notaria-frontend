import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@/authentication/lib";

export async function middleware(request = NextRequest) {
    const url = request.nextUrl.clone();
    const session = await getSession();

    if (session !== null && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } 
    if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (request.nextUrl.pathname.startsWith("/juniors") || request.nextUrl.pathname.startsWith("/seniors")) {
        const role = session?.user?.payload?.role;
    
        if (role == "junior") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    if (url.pathname === '/dashboard/processContract/generateScript') {
        const contractType = url.searchParams.get('contractType');

        if (contractType === 'compraVentaPropiedad') {
            url.pathname = '/dashboard/processContract/generateScript/inmuebles';
            return NextResponse.redirect(url);
        }

        if (['asociacion', 'RS', 'SCRL', 'SAC'].includes(contractType ?? '')) {
            url.pathname = '/dashboard/processContract/generateScript/constitucion';
            return NextResponse.redirect(url);
        }
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        '/login', 
        '/dashboard/:path*',
        '/dashboard/processContract/generateScript',
    ],
}