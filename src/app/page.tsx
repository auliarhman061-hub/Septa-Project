import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Logo Icon */}
              <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              <span className="font-bold text-lg text-slate-800">
                Sistem Informasi Akademik SMP
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700
                  hover:text-amber-600 transition-colors duration-200"
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-600
                  text-white rounded-lg transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-6">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                Demo Skripsi Prototype
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                Gestão Informasi Akademik{" "}
                <span className="text-amber-500">Sekolah</span> Lebih Mudah
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                Sistem Informasi Akademik SMP berbasis web untuk mengelola
                data siswa, guru, kelas, jadwal, absensi, nilai, dan rapor
                secara digital — cocok untuk demo skripsi dan prototype
                production-ready.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500
                    hover:bg-amber-600 text-white font-bold rounded-lg
                    transition-colors duration-200 shadow-sm"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Masuk ke Sistem
                </Link>
                <Link
                  href="#fitur"
                  className="inline-flex items-center gap-2 px-6 py-3
                    border border-slate-300 hover:border-slate-400
                    text-slate-700 font-semibold rounded-lg
                    transition-colors duration-200 bg-white"
                >
                  Lihat Fitur
                </Link>
              </div>
            </div>

            {/* Feature Cards Preview */}
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "👩‍🏫",
                  title: "Dashboard Guru",
                  desc: "Input absensi & nilai dengan mudah",
                  color: "amber",
                },
                {
                  icon: "👨‍🎓",
                  title: "Dashboard Siswa",
                  desc: "Lihat jadwal, nilai, dan rapor",
                  color: "orange",
                },
                {
                  icon: "📊",
                  title: "Laporan Kepala Sekolah",
                  desc: "Rekap akademik menyeluruh",
                  color: "lime",
                },
                {
                  icon: "👨‍👩‍👧",
                  title: "Dashboard Orang Tua",
                  desc: "Pantau perkembangan anak",
                  color: "amber",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`card p-5 hover:shadow-md transition-shadow duration-200
                    ${item.color === "amber" ? "hover:border-amber-200" : ""}
                    ${item.color === "orange" ? "hover:border-orange-200" : ""}
                    ${item.color === "lime" ? "hover:border-lime-200" : ""}
                  `}
                >
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-slate-800 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Feature Grid */}
      <section id="fitur" className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Fitur Utama
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Sistem dirancang untuk membantu administrasi akademik sekolah
              dengan fitur yang lengkap dan tampilan yang modern.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Manajemen Data Siswa",
                desc: "CRUD data siswa dengan NIS unik, kelas, dan informasi lengkap.",
                color: "amber",
              },
              {
                title: "Manajemen Data Guru",
                desc: "Kelola data guru, NIP, email, dan relasi mata pelajaran.",
                color: "orange",
              },
              {
                title: "Manajemen Kelas",
                desc: "Atur kelas, wali kelas, dan tahun ajaran aktif.",
                color: "lime",
              },
              {
                title: "Jadwal Pelajaran",
                desc: "Buat jadwal dengan validasi bentrok otomatis.",
                color: "amber",
              },
              {
                title: "Absensi Digital",
                desc: "Input absensi massal per tanggal dan kelas.",
                color: "orange",
              },
              {
                title: "Nilai & Rapor",
                desc: "Input nilai tugas, UTS, UAS dan generate rapor semester.",
                color: "lime",
              },
            ].map((item) => (
              <div key={item.title} className="card p-5">
                <div
                  className={`w-10 h-10 rounded-lg mb-4 flex items-center justify-center
                    ${item.color === "amber" ? "bg-amber-100" : ""}
                    ${item.color === "orange" ? "bg-orange-100" : ""}
                    ${item.color === "lime" ? "bg-lime-100" : ""}
                  `}
                >
                  <svg
                    className={`w-5 h-5
                      ${item.color === "amber" ? "text-amber-600" : ""}
                      ${item.color === "orange" ? "text-orange-600" : ""}
                      ${item.color === "lime" ? "text-lime-600" : ""}
                    `}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded-md flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
              <span className="font-semibold text-slate-700 text-sm">
                Sistem Informasi Akademik SMP
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Demo Skripsi Prototype · Stack: Next.js + Prisma + Neon PostgreSQL
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}