// ══════════════════════════════════════════════
// Middleware — Route Protection
// Sistem Informasi Akademik SMP
//
// Middleware ini memproteksi semua route dashboard.
// User yang belum login akan diarahkan ke /login.
// User dengan role yang salah akan diarahkan ke dashboard sesuai role-nya.
// ══════════════════════════════════════════════

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";

// ─── Config ───────────────────────────────────

export const config = {
  matcher: [
    "/((?!/$|_next/static|_next/image|favicon.ico|$).*)",
  ],
};

// ─── Role Redirect Map ───────────────────────

const ROLE_REDIRECT: Record<Role, string> = {
  ADMIN: "/dashboard/admin",
  TEACHER: "/dashboard/guru",
  STUDENT: "/dashboard/siswa",
  PRINCIPAL: "/dashboard/kepala-sekolah",
  PARENT: "/dashboard/orang-tua",
};

// ─── Protected Routes Map ────────────────────

const PROTECTED_ROUTES: Record<string, Role[]> = {
  // Admin routes
  "/dashboard/admin": ["ADMIN"],
  "/admin/siswa": ["ADMIN"],
  "/admin/guru": ["ADMIN"],
  "/admin/kelas": ["ADMIN"],
  "/admin/mapel": ["ADMIN"],
  "/admin/jadwal": ["ADMIN"],
  "/admin/akun": ["ADMIN"],

  // Guru routes
  "/dashboard/guru": ["TEACHER"],
  "/guru/jadwal": ["TEACHER"],
  "/guru/absensi": ["TEACHER"],
  "/guru/nilai": ["TEACHER"],

  // Siswa routes
  "/dashboard/siswa": ["STUDENT"],
  "/siswa/jadwal": ["STUDENT"],
  "/siswa/absensi": ["STUDENT"],
  "/siswa/nilai": ["STUDENT"],
  "/siswa/rapor": ["STUDENT"],

  // Kepala sekolah routes
  "/dashboard/kepala-sekolah": ["PRINCIPAL"],
  "/kepala-sekolah/laporan": ["PRINCIPAL"],
  "/kepala-sekolah/absensi": ["PRINCIPAL"],

  // Orang tua routes
  "/dashboard/orang-tua": ["PARENT"],
  "/orang-tua/anak": ["PARENT"],
  "/orang-tua/nilai": ["PARENT"],
  "/orang-tua/absensi": ["PARENT"],
  "/orang-tua/rapor": ["PARENT"],

  // API routes (semua role bisa, dicek per-route di server)
  "/api/": ["ADMIN", "TEACHER", "STUDENT", "PRINCIPAL", "PARENT"],
};

// ─── Handler ──────────────────────────────────

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // ── Public routes ─────────────────────────────
  const isPublic =
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (isPublic) {
    // Jika sudah login dan akses /login → redirect
    if (pathname === "/login" && req.auth?.user) {
      const role = req.auth.user.role as Role;
      return NextResponse.redirect(
        new URL(ROLE_REDIRECT[role], req.url)
      );
    }
    return NextResponse.next();
  }

  // ── Cek session ───────────────────────────────
  if (!req.auth?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = req.auth.user.role as Role;

  // ── Cek role untuk route ini ─────────────────
  for (const [prefix, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(
          new URL(ROLE_REDIRECT[userRole], req.url)
        );
      }
      break;
    }
  }

  return NextResponse.next();
});