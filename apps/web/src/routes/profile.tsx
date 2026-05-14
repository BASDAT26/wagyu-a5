import { useState, useMemo, useEffect } from "react";
import {
  Lock,
  Edit3,
  User,
  Mail,
  Phone,
  Building2,
  AtSign,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ChevronRight,
  Shield,
  CreditCard,
  Bell,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { trpcClient, trpc } from "@/utils/trpc";
import { toast } from "sonner";
import type { Role } from "@/data/type";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string })?.role ?? "CUSTOMER";
  const [isEditing, setIsEditing] = useState(false);

  // Fetch real data
  const { data: customerData, isLoading: customerLoading } = useQuery(
    trpc.user.customer.me.queryOptions({
      enabled: role === "CUSTOMER",
    }),
  );
  const { data: organizerData, isLoading: organizerLoading } = useQuery(
    trpc.user.organizer.me.queryOptions({
      enabled: role === "ORGANIZER",
    }),
  );

  const [editData, setEditData] = useState<{ name: string; phoneEmail: string }>({
    name: "",
    phoneEmail: "",
  });

  useEffect(() => {
    if (role === "CUSTOMER" && customerData) {
      setEditData({
        name: customerData.full_name,
        phoneEmail: customerData.phone_number || "",
      });
    } else if (role === "ORGANIZER" && organizerData) {
      setEditData({
        name: organizerData.organizer_name,
        phoneEmail: organizerData.contact_email || "",
      });
    }
  }, [customerData, organizerData, role]);

  const updateCustomer = useMutation({
    mutationFn: (data: any) => trpcClient.user.customer.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.customer.me.queryOptions());
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui");
    },
  });

  const updateOrganizer = useMutation({
    mutationFn: (data: any) => trpcClient.user.organizer.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.user.organizer.me.queryOptions());
      setIsEditing(false);
      toast.success("Profil berhasil diperbarui");
    },
  });

  const handleUpdateProfile = () => {
    if (role === "CUSTOMER") {
      updateCustomer.mutate({
        customerId: customerData.customer_id,
        fullName: editData.name,
        phoneNumber: editData.phoneEmail,
      });
    } else {
      updateOrganizer.mutate({
        organizerId: organizerData.organizer_id,
        organizerName: editData.name,
        contactEmail: editData.phoneEmail,
      });
    }
  };

  // Password states
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);

  const handleUpdatePassword = async () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      toast.error("Semua kolom password harus diisi.");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Password baru dan konfirmasi tidak cocok.");
      return;
    }

    setIsSubmittingPass(true);
    // Simulate password update
    setTimeout(() => {
      toast.success("Password berhasil diperbarui!");
      setPasswords({ old: "", new: "", confirm: "" });
      setIsSubmittingPass(false);
    }, 1000);
  };

  const initial = (session?.user.name?.[0] || role[0]).toUpperCase();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Akses Ditolak</h2>
          <p className="text-sm text-slate-500">
            Silakan login terlebih dahulu untuk melihat profil.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20"
          >
            Login Sekarang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500">
      <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ── Left Sidebar (Navigation) ── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-500/20 transition-colors" />

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-500/40 ring-4 ring-white dark:ring-slate-800 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                    {initial}
                  </div>
                  <div
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-slate-900 rounded-full shadow-lg"
                    title="Online"
                  />
                </div>

                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1">
                  {session.user.name}
                </h2>
                <div className="flex items-center gap-2 mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      role === "ADMIN"
                        ? "bg-red-100 text-red-600 border border-red-200"
                        : role === "ORGANIZER"
                          ? "bg-purple-100 text-purple-600 border border-purple-200"
                          : "bg-blue-100 text-blue-600 border border-blue-200"
                    }`}
                  >
                    {role}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                    ID: {session.user.id.slice(0, 8)}
                  </span>
                </div>

                <div className="w-full space-y-2">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-bold text-sm group/item">
                    <div className="flex items-center gap-3">
                      <User size={18} /> Profil Umum
                    </div>
                    <ChevronRight
                      size={16}
                      className="opacity-50 group-hover/item:translate-x-1 transition-transform"
                    />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold text-sm group/item transition-colors">
                    <div className="flex items-center gap-3">
                      <Lock size={18} /> Keamanan
                    </div>
                    <ChevronRight
                      size={16}
                      className="opacity-0 group-hover/item:opacity-50 group-hover/item:translate-x-1 transition-all"
                    />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold text-sm group/item transition-colors">
                    <div className="flex items-center gap-3">
                      <CreditCard size={18} /> Billing
                    </div>
                    <ChevronRight
                      size={16}
                      className="opacity-0 group-hover/item:opacity-50 group-hover/item:translate-x-1 transition-all"
                    />
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 w-full">
                  <button
                    onClick={() =>
                      authClient.signOut({
                        fetchOptions: { onSuccess: () => (window.location.href = "/") },
                      })
                    }
                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 font-bold text-sm transition-colors"
                  >
                    <LogOut size={18} /> Keluar Akun
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Content Area ── */}
          <div className="lg:col-span-8 space-y-8">
            {/* Profile Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
              <div className="p-8 lg:p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                      Detail Profil
                    </h3>
                    <p className="text-xs font-medium text-slate-400">
                      Informasi identitas Anda di platform
                    </p>
                  </div>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 hover:shadow-md transition-all active:scale-95"
                  >
                    <Edit3 size={14} /> Edit Profil
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>

              <div className="p-8 lg:p-10 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      Nama Lengkap
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {role === "ORGANIZER" ? <Building2 size={18} /> : <User size={18} />}
                      </div>
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className={`w-full pl-12 pr-4 h-14 rounded-2xl text-sm font-bold border transition-all ${
                          isEditing
                            ? "bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900 ring-4 ring-blue-500/5 focus:outline-none"
                            : "bg-slate-50/50 dark:bg-slate-800/30 border-transparent cursor-default"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      {role === "ORGANIZER" ? "Email Kontak" : "Nomor Telepon"}
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                        {role === "ORGANIZER" ? <Mail size={18} /> : <Phone size={18} />}
                      </div>
                      <input
                        type="text"
                        readOnly={!isEditing}
                        value={editData.phoneEmail}
                        onChange={(e) => setEditData({ ...editData, phoneEmail: e.target.value })}
                        className={`w-full pl-12 pr-4 h-14 rounded-2xl text-sm font-bold border transition-all ${
                          isEditing
                            ? "bg-white dark:bg-slate-900 border-blue-200 dark:border-blue-900 ring-4 ring-blue-500/5 focus:outline-none"
                            : "bg-slate-50/50 dark:bg-slate-800/30 border-transparent cursor-default"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <AtSign size={18} />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={`@${session.user.name.toLowerCase().replace(/\s+/g, "")}`}
                        className="w-full pl-12 pr-4 h-14 rounded-2xl text-sm font-bold border border-transparent bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      Email Utama
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="text"
                        readOnly
                        value={session.user.email}
                        className="w-full pl-12 pr-4 h-14 rounded-2xl text-sm font-bold border border-transparent bg-slate-50/50 dark:bg-slate-800/30 text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden">
              <div className="p-8 lg:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl shadow-lg">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">
                    Keamanan
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    Kelola kata sandi dan proteksi akun
                  </p>
                </div>
              </div>

              <div className="p-8 lg:p-10 space-y-8">
                <div className="space-y-6 max-w-xl">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      value={passwords.old}
                      onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-5 h-14 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-slate-300 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-5 h-14 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-slate-300 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">
                        Konfirmasi
                      </label>
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-5 h-14 rounded-2xl text-sm font-bold border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 focus:outline-none focus:border-slate-300 transition-all"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isSubmittingPass}
                    className="w-full md:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-xs font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isSubmittingPass ? "Memproses..." : "Update Kata Sandi"}
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="p-8 lg:p-10 bg-red-50/50 dark:bg-red-900/10 rounded-[2.5rem] border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-2xl">
                  <Trash2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-red-900 dark:text-red-400">Hapus Akun</h3>
                  <p className="text-xs font-medium text-red-600/60">
                    Semua data Anda akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              <button className="px-6 py-3 border-2 border-red-200 dark:border-red-900/50 text-red-600 rounded-2xl text-xs font-black hover:bg-red-600 hover:text-white transition-all active:scale-95">
                Hapus Akun Saya
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
