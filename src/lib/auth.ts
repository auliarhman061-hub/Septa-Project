import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// ══════════════════════════════════════════════
// NextAuth v5 Configuration
// Sistem Informasi Akademik SMP
// ══════════════════════════════════════════════

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Akun Sekolah",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // ── Validasi input ─────────────────────
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // ── Cari user di database ────────────────
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            isActive: true,
          },
        });

        if (!user) return null;

        // ── Cek akun aktif ────────────────────
        if (!user.isActive) return null;

        // ── Verifikasi password ───────────────
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) return null;

        // ── Return user tanpa passwordHash ─────
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // Simpan data extra ke JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: string }).role;
      }
      return token;
    },

    // Simpan data dari JWT ke session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },

  pages: {
    // Custom halaman login
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,
});