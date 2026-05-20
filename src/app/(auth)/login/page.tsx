// ══════════════════════════════════════════════
// Login Page
// Sistem Informasi Akademik SMP
//
// Halaman login production-ready dengan:
// - Form login email + password
// - Validasi client-side (HTML5 required + pattern)
// - Error message dari NextAuth
// - Tampilan akun demo
// - Redirect setelah login berdasarkan role
// ══════════════════════════════════════════════

"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "CredentialsSignin"
      ? "Email atau password yang Anda masukkan salah."
      : searchParams.get("error")
      ? "Terjadi kesalahan saat login. Silakan coba lagi."
      : null
  );
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email dan password wajib diisi.");
      return;
    }

    setIsPending(true);

    signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      callbackUrl,
    }).then((res) => {
      if (res?.error) {
        setError("Email atau password yang Anda masukkan salah.");
        setIsPending(false);
      }
    });
  };

  return (
    <div className="card p-8 shadow-sm border-t-4 border-amber-500">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@smpdemo.test"
            required
            autoComplete="email"
            disabled={isPending}
            className="input"
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
            required
            autoComplete="current-password"
            disabled={isPending}
            className="input"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary w-full py-2.5 text-base"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Memproses...
            </span>
          ) : (
            "Masuk"
          )}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm font-semibold text-amber-700">
              Akun Demo
            </p>
          </div>
          <div className="space-y-2 text-xs">
            {[
              { role: "Admin", email: "admin@smpdemo.test", color: "bg-amber-400" },
              { role: "Guru", email: "guru@smpdemo.test", color: "bg-orange-400" },
              { role: "Siswa", email: "siswa@smpdemo.test", color: "bg-lime-400" },
              { role: "Kepala Sekolah", email: "kepala@smpdemo.test", color: "bg-sky-400" },
              { role: "Orang Tua", email: "orangtua@smpdemo.test", color: "bg-purple-400" },
            ].map((account) => (
              <div key={account.email} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${account.color}`} />
                  <span className="text-slate-600 font-medium">{account.role}</span>
                </div>
                <span className="text-slate-500 font-mono">{account.email}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-amber-200 mt-2">
              <span className="text-amber-600 font-medium">Password: password123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Memuat...</div>
      </div>
    }>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 px-4">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Sistem Informasi Akademik SMP
            </h1>
            <p className="text-sm text-slate-500 mt-1">Masuk ke akun Anda</p>
          </div>

          <LoginForm />

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 mt-4">
            Demo Skripsi Prototype ·{" "}
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Kembali ke Beranda
            </Link>
          </p>
        </div>
      </div>
    </Suspense>
  );
}