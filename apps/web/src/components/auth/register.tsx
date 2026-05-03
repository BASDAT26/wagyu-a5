import { useState } from "react";
import { Button } from "@wagyu-a5/ui/components/button";
import { Input } from "@wagyu-a5/ui/components/input";
import { Label } from "@wagyu-a5/ui/components/label";
import { User, Building2, ShieldCheck, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

type Role = "Pelanggan" | "Penyelenggara" | "Administrator" | null;

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>(null);

  // Form states
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [terms, setTerms] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (role === "Pelanggan" || role === "Penyelenggara") {
      if (!namaLengkap.trim()) newErrors.namaLengkap = "Nama Lengkap wajib diisi";
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Email tidak valid";
      if (!nomorTelepon.trim()) newErrors.nomorTelepon = "Nomor Telepon wajib diisi";
    }

    if (!username.trim()) newErrors.username = "Username wajib diisi";
    if (!password || password.length < 6) newErrors.password = "Password minimal 6 karakter";
    if (password !== konfirmasiPassword) newErrors.konfirmasiPassword = "Konfirmasi password tidak cocok";
    if (!terms) newErrors.terms = "Anda harus menyetujui Syarat & Ketentuan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      toast.success("Akun berhasil dibuat! Silakan login.", {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      });
      // Simulasi redirect ke login
      navigate("/login");
    } else {
      toast.error("Terdapat field yang kosong atau tidak valid.");
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 flex flex-col items-center p-4">
      <div className="my-auto w-full max-w-[460px] py-8 flex flex-col items-center">
        {/* Logo & Header */}
        <div className="text-center mb-10 animate-in slide-in-from-bottom-4 duration-500">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/20 rounded-2xl mx-auto flex items-center justify-center mb-6 transform rotate-3 hover:rotate-0 transition-transform">
            <span className="text-white font-black text-2xl tracking-tighter">TT</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">TikTakTuk</h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Daftar untuk Memulai Perjalanan Anda</p>
        </div>

        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/20 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle decorative blob */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

          {!role ? (
            /* ------------------- ROLE SELECTION ------------------- */
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 relative z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Jenis Pengguna</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                  Pilih jenis akun yang paling sesuai dengan kebutuhan Anda di platform kami.
                </p>
              </div>

              <div className="space-y-4">
                {/* Customer */}
                <button
                  onClick={() => setRole("Pelanggan")}
                  className="group w-full flex flex-col items-start p-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Pelanggan</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-[3.25rem]">
                    Beli, temukan, dan kelola tiket untuk berbagai acara favorit Anda.
                  </p>
                </button>

                {/* Organizer */}
                <button
                  onClick={() => setRole("Penyelenggara")}
                  className="group w-full flex flex-col items-start p-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Penyelenggara</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-[3.25rem]">
                    Buat acara, kelola venue, dan pantau penjualan tiket Anda.
                  </p>
                </button>

                {/* Admin */}
                <button
                  onClick={() => setRole("Administrator")}
                  className="group w-full flex flex-col items-start p-5 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md hover:shadow-emerald-500/10 transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Administrator</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-[3.25rem]">
                    Kelola sistem, verifikasi entitas, dan pantau aktivitas platform secara penuh.
                  </p>
                </button>
              </div>
            </div>
          ) : (
            /* ------------------- REGISTER FORM ------------------- */
            <div className="animate-in slide-in-from-right-8 duration-500 relative z-10">
              <button
                onClick={() => {
                  setRole(null);
                  setErrors({});
                }}
                className="group flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium mb-8 transition-colors w-fit"
              >
                <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                </div>
                Kembali
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  Daftar sebagai <span className="text-blue-600 dark:text-blue-400">{role}</span>
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Lengkapi informasi di bawah ini untuk membuat akun baru Anda.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {(role === "Pelanggan" || role === "Penyelenggara") && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nama Lengkap</Label>
                      <Input
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="rounded-xl h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                      />
                      {errors.namaLengkap && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errors.namaLengkap}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email</Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nama@email.com"
                        type="email"
                        className="rounded-xl h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                      />
                      {errors.email && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Nomor Telepon</Label>
                      <Input
                        value={nomorTelepon}
                        onChange={(e) => setNomorTelepon(e.target.value)}
                        placeholder="+62 atau 08..."
                        type="tel"
                        className="rounded-xl h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                      />
                      {errors.nomorTelepon && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errors.nomorTelepon}</p>}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Username</Label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Pilih username unik"
                    className="rounded-xl h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                  />
                  {errors.username && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errors.username}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Password</Label>
                    <Input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 karakter"
                      type="password"
                      className="rounded-xl h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                    />
                    {errors.password && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Konfirmasi</Label>
                    <Input
                      value={konfirmasiPassword}
                      onChange={(e) => setKonfirmasiPassword(e.target.value)}
                      placeholder="Ulangi password"
                      type="password"
                      className="rounded-xl h-11 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-sm focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                    />
                    {errors.konfirmasiPassword && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errors.konfirmasiPassword}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 pb-1">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 dark:border-slate-700 dark:bg-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label htmlFor="terms" className="text-sm text-slate-600 dark:text-slate-400 font-normal leading-snug block cursor-pointer">
                      Saya menyetujui <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Syarat & Ketentuan</a> serta <a href="#" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Kebijakan Privasi</a> yang berlaku.
                    </Label>
                    {errors.terms && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{errors.terms}</p>}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-bold text-base mt-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
                  Daftar Sekarang
                </Button>
              </form>
            </div>
          )}
        </div>

        <p className="mt-8 text-sm font-medium text-slate-600 dark:text-slate-400">
          Sudah memiliki akun?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
)}
