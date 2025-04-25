import { NextResponse, NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
    console.log("Middleware is running...");

    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;
    const { pathname } = request.nextUrl;


    if (pathname === "/login") {
        if (token?.trim() && role?.trim()) {
            if (role === "Manager") {
                return NextResponse.redirect(new URL("/manager/dashboard", request.url));
            } else if (role === "Cashier") {
                return NextResponse.redirect(new URL("/cashier/dashboard", request.url));
            }
        }
        return NextResponse.next(); // Boleh akses login kalau belum login
    }

    // Arahkan root ke login
    if (pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Middleware untuk halaman manager
    if (pathname.startsWith("/manager")) {
        if (!token?.trim() || !role?.trim()) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (role !== "Manager") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    }

    // Middleware untuk halaman cashier
    if (pathname.startsWith("/cashier")) {
        if (!token?.trim() || !role?.trim()) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        if (role !== "Cashier") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        "/",                // Root
        "/login",          // Halaman login
        "/manager/:path*", // Semua halaman di bawah /manager
        "/cashier/:path*", // Semua halaman di bawah /cashier
    ],


    // Jika pengguna mencoba mengakses halaman root, arahkan ke login
    //     if (request.nextUrl.pathname === "/") {
    //         return NextResponse.redirect(new URL("/login", request.url));
    //     }

    //     // Cek apakah pengguna mencoba mengakses halaman manager
    //     if (request.nextUrl.pathname.startsWith('/manager')) {
    //         // Jika tidak ada token atau role, diarahkan ke halaman login
    //         if (!token?.trim() || !role?.trim()) {
    //             return NextResponse.redirect(new URL("/login", request.url));
    //         }


    //         // Jika role bukan MANAGER, arahkan ke halaman login
    //         if (role !== "Manager") {
    //             return NextResponse.redirect(new URL("/login", request.url));
    //         }

    //         // Jika semua cek berhasil, lanjutkan ke halaman yang diminta
    //         return NextResponse.next();
    //     }

    //     if (request.nextUrl.pathname.startsWith('/cashier')) {
    //         if (!token?.trim() || !role?.trim()) {
    //             return NextResponse.redirect(new URL("/login", request.url));
    //         }

    //         if (role !== "Cashier") {
    //             return NextResponse.redirect(new URL("/login", request.url));
    //         }

    //         return NextResponse.next();
    //     }

    //     return NextResponse.next();
    // }

    // export const config = {
    //     matcher: [
    //         "/manager/:path*", // Menangkap semua rute di bawah /manager
    //         "/cashier/:path*", // Menangkap semua rute di bawah /manager
    //         "/" // Menangkap rute root
    //     ]
}
