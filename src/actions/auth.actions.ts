// ══════════════════════════════════════════════
// Auth Server Actions
// Sistem Informasi Akademik SMP
// ══════════════════════════════════════════════

"use server";

import { signOut } from "@/lib/auth";

// ─── Logout ────────────────────────────────────
// Memutuskan session user dan redirect ke landing page.

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

// ─── Login Action ──────────────────────────────
// Tidak perlu di sini karena NextAuth menangani login secara otomatis.
// Halaman login menggunakan form yang submit ke NextAuth.
// File ini disediakan untuk action-based login jika diperlukan.

// import { signIn } from "@/lib/auth";

// export async function loginAction(
//   prevState: unknown,
//   formData: FormData
// ) {
//   const email = formData.get("email") as string;
//   const password = formData.get("password") as string;
//
//   try {
//     await signIn("credentials", {
//       email,
//       password,
//       redirect: false,
//     });
//     return { success: true, message: "Login berhasil" };
//   } catch (error) {
//     return { success: false, message: "Email atau password salah" };
//   }
// }