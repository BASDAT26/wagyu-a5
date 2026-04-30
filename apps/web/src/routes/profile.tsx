import { useState } from "react";
import { Lock, Edit3, User, Mail, Phone, Building2, AtSign, ShieldAlert } from "lucide-react";

type Role = "Customer" | "Organizer";

export default function ProfilePage() {
  const [role, setRole] = useState<Role>("Customer");
  const [isEditing, setIsEditing] = useState(false);

  // Mock data states
  const [customerData, setCustomerData] = useState({
    name: "Budi Santoso",
    phone: "+62812345678",
    username: "@customer1",
  });

  const [organizerData, setOrganizerData] = useState({
    name: "Andi Wijaya",
    email: "organizer1@example.com",
    username: "@organizer1",
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 p-6 font-sans flex justify-center">
      <div className="w-full max-w-3xl space-y-8">

        {/* --- Role Simulator --- */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Simulasi Tampilan Profil</h2>
              <p className="text-xs text-slate-500">Pilih role untuk melihat perbedaan kolom profil yang bisa di-edit.</p>
            </div>
          </div>
          <div className="flex gap-2 bg-slate-50 dark:bg-slate-800/50 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
            {(["Customer", "Organizer"] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setIsEditing(false); }}
                className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  role === r 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1 tracking-tight">Profil Saya</h1>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Kelola informasi pribadi dan preferensi akun Anda</p>
        </div>

        {/* ── Profile Information Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-black shadow-inner">
                {role === "Customer" ? "B" : "A"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Informasi Profil</h2>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Kelola data pribadi Anda di platform TikTakTuk</p>
              </div>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 h-9 rounded-full border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit3 size={14} /> Edit
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 h-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Simpan
              </button>
            )}
          </div>

          <div className="space-y-8">
            {/* Role Badge (Read Only) */}
            <div>
              <p className="text-[11px] font-bold text-slate-500 mb-2">Role / Peran</p>
              {role === "Customer" ? (
                <span className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold tracking-tight">
                  Pelanggan
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-bold tracking-tight">
                  Penyelenggara
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Dynamic Fields based on Role */}
              {role === "Customer" ? (
                <>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><User size={14} /> Nama Lengkap</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={customerData.name} 
                        onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-900" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{customerData.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><Phone size={14} /> Nomor Telepon</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={customerData.phone} 
                        onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-900" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{customerData.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><AtSign size={14} /> Username <span className="font-normal text-[10px] text-slate-400">(Read-only)</span></p>
                    <p className="text-sm font-semibold text-slate-500">{customerData.username}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><Building2 size={14} /> Nama Organizer</p>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={organizerData.name} 
                        onChange={(e) => setOrganizerData({...organizerData, name: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-900" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{organizerData.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><Mail size={14} /> Contact Email</p>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={organizerData.email} 
                        onChange={(e) => setOrganizerData({...organizerData, email: e.target.value})}
                        className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-900" 
                      />
                    ) : (
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{organizerData.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5"><AtSign size={14} /> Username <span className="font-normal text-[10px] text-slate-400">(Read-only)</span></p>
                    <p className="text-sm font-semibold text-slate-500">{organizerData.username}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Update Password Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-[20px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Lock size={18} /> Update Password
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Perbarui password Anda untuk menjaga keamanan akun</p>
          </div>

          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Password Lama</label>
              <input 
                type="password" 
                placeholder="Password Lama" 
                className="w-full h-[42px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-400 transition-colors bg-transparent placeholder:text-slate-400" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Password Baru</label>
              <input 
                type="password" 
                placeholder="Password Baru" 
                className="w-full h-[42px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-400 transition-colors bg-transparent placeholder:text-slate-400" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Konfirmasi Password Baru</label>
              <input 
                type="password" 
                placeholder="Konfirmasi Password Baru" 
                className="w-full h-[42px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-slate-400 transition-colors bg-transparent placeholder:text-slate-400" 
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <button className="px-6 h-[42px] rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-[13px] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
              Cancel
            </button>
            <button className="px-6 h-[42px] rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[13px] hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-sm">
              Update Password
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
