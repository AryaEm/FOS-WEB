import { NextResponse, NextRequest } from "next/server";

export const middleware = async (request: NextRequest) => {
    console.log("Middleware is running...");    

    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("role")?.value;

    // Jika pengguna mencoba mengakses halaman root, arahkan ke login
    if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Cek apakah pengguna mencoba mengakses halaman manager
    if (request.nextUrl.pathname.startsWith('/manager')) {
        // Jika tidak ada token atau role, diarahkan ke halaman login
        if (!token?.trim() || !role?.trim()) {
            return NextResponse.redirect(new URL("/login", request.url));
        }


        // Jika role bukan MANAGER, arahkan ke halaman login
        if (role !== "Manager") {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        // Jika semua cek berhasil, lanjutkan ke halaman yang diminta
        return NextResponse.next();
    }

    // Untuk semua halaman lainnya, lanjutkan tanpa perubahan
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/manager/:path*", // Menangkap semua rute di bawah /manager
        "/" // Menangkap rute root
    ]
}
