// ══════════════════════════════════════════════
// Auth Config — Edge-Compatible Subset
// Sistem Informasi Akademik SMP
//
// File ini hanya meng-export auth() yang aman untuk Edge Runtime.
// Dipakai oleh middleware.ts untuk route protection.
//
// ⚠️ File ini TIDAK menggunakan bcrypt atau Prisma.
// bcryptjs hanya hidup di src/lib/auth.ts (route handler).
//
// Kenapa dipisah:
// - middleware.ts berjalan di Edge Runtime (Vercel Edge Functions)
// - Edge Runtime TIDAK mendukung Node.js API (process.nextTick, fs, crypto Node)
// - bcryptjs menggunakan process.nextTick / setImmediate → tidak Edge-safe
// - Dengan memisah, middleware tidak menarik bcryptjs ke dalam bundle-nya
// ══════════════════════════════════════════════

import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import type { Role } from "@prisma/client";

const authConfig: NextAuthConfig = {
  // Providers kosong — kita tidak perlu authorize di middleware.
  // Middleware hanya perlu baca JWT token untuk dapat role/user info.
  // authorize() (dengan bcrypt) hanya dijalankan di route handler /api/auth.
  providers: [],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  callbacks: {
    // JWT callback untuk menyimpan user data di token.
    // Ini adalah subset minimal — authorize() ada di lib/auth.ts.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },

    // Session callback untuk expose user data ke session.
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
};

// Export nama `auth` agar signature sama dengan lib/auth.ts
// sehingga middleware.ts tidak perlu perubahan nama import.
export const { auth } = NextAuth(authConfig);