import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

// ---------------------------------------------------------------------------
// Data links per peran (sama dengan header.tsx)
// ---------------------------------------------------------------------------

type NavItem = { to: string; label: string };
type Role = "guest" | "admin" | "organizer" | "customer";

const LINKS: Record<Role, NavItem[]> = {
  guest: [
    { to: "/login", label: "Login" },
    { to: "/login", label: "Registrasi" },
  ],
  admin: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/venue", label: "Manajemen Venue" },
    { to: "/seat", label: "Manajemen Kursi" },
    { to: "/ticket-category", label: "Kategori Tiket" },
    { to: "/ticket", label: "Manajemen Tiket" },
    { to: "/order", label: "Semua Order" },
    { to: "/ticket", label: "Tiket (Aset)" },
    { to: "/order", label: "Order (Aset)" },
    { to: "/profile", label: "Profile" },
  ],
  organizer: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/event", label: "Event Saya" },
    { to: "/venue", label: "Manajemen Venue" },
    { to: "/seat", label: "Manajemen Kursi" },
    { to: "/ticket-category", label: "Kategori Tiket" },
    { to: "/ticket", label: "Manajemen Tiket" },
    { to: "/order", label: "Semua Order" },
    { to: "/ticket", label: "Tiket (Aset)" },
    { to: "/order", label: "Order (Aset)" },
    { to: "/profile", label: "Profile" },
  ],
  customer: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/ticket", label: "Tiket Saya" },
    { to: "/order", label: "Pesanan" },
    { to: "/cari-event", label: "Cari Event" },
    { to: "/promosi", label: "Promosi" },
    { to: "/venue", label: "Venue" },
    { to: "/artist", label: "Artis" },
  ],
};

const ROLE_LABELS: Record<Role, string> = {
  guest: "Guest (Belum Login)",
  admin: "Admin",
  organizer: "Organizer",
  customer: "Customer",
};

const ROLE_COLORS: Record<Role, string> = {
  guest: "bg-muted text-muted-foreground border-border",
  admin: "bg-red-500/10 text-red-500 border-red-500/30",
  organizer: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  customer: "bg-green-500/10 text-green-500 border-green-500/30",
};

// ---------------------------------------------------------------------------
// Mini preview navbar per role
// ---------------------------------------------------------------------------

function NavbarPreview({ role }: { role: Role }) {
  const links = LINKS[role];
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Role badge */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/40 border-b border-border">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[role]}`}
        >
          {ROLE_LABELS[role]}
        </span>
        <span className="text-xs text-muted-foreground">{links.length} item</span>
      </div>

      {/* Navbar mockup */}
      <div className="bg-background/80 backdrop-blur-md">
        {/* Desktop bar */}
        <div className="flex h-12 items-center justify-between px-4 gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-md bg-primary text-primary-foreground text-[10px] font-black">
              W
            </span>
            <span className="text-sm font-bold">wagyu-a5</span>
          </div>

          {/* Links (scroll horizontally if too many) */}
          <nav className="flex items-center gap-0.5 overflow-x-auto flex-1 px-2 scrollbar-none">
            {links.map((link) => (
              <span
                key={`${link.to}-${link.label}`}
                className="whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-default transition-colors"
              >
                {link.label}
              </span>
            ))}
          </nav>

          {/* Right controls mockup */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme toggle stub */}
            <span className="h-7 w-7 rounded-md border border-border flex items-center justify-center text-muted-foreground text-xs">
              ☀
            </span>
            {role !== "guest" ? (
              <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium">
                User <ChevronDown size={10} />
              </span>
            ) : null}
            {/* Mobile icon */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="sm:hidden rounded-md p-1 border border-border"
            >
              {mobileOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown mockup */}
        {mobileOpen && (
          <div className="border-t border-border px-4 py-2 flex flex-col gap-0.5">
            {links.map((link) => (
              <span
                key={`m-${link.to}-${link.label}`}
                className="px-3 py-1.5 text-xs font-medium rounded-md text-muted-foreground hover:bg-accent cursor-default transition-colors"
              >
                {link.label}
              </span>
            ))}
            {role !== "guest" && (
              <span className="mt-1 px-3 py-1.5 text-xs font-medium rounded-md text-destructive cursor-default">
                Logout
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Navbar showcase component (dipakai di /putih)
// ---------------------------------------------------------------------------

export default function Navbar() {
  const roles: Role[] = ["guest", "admin", "organizer", "customer"];

  return (
    <section className="w-full space-y-6 p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Navbar</h2>
        <p className="text-sm text-muted-foreground">
          Tampilan navbar berdasarkan peran pengguna. Klik ikon hamburger (☰) untuk melihat tampilan
          mobile.
        </p>
      </div>

      <div className="grid gap-5">
        {roles.map((role) => (
          <NavbarPreview key={role} role={role} />
        ))}
      </div>

      {/* Link list summary */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-4 py-3 bg-muted/40 border-b border-border">
          <h3 className="text-sm font-semibold">Ringkasan Menu</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border">
          {roles.map((role) => (
            <div key={role} className="p-4 space-y-2">
              <span
                className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[role]}`}
              >
                {ROLE_LABELS[role]}
              </span>
              <ul className="space-y-1">
                {LINKS[role].map((link) => (
                  <li key={`sum-${link.to}-${link.label}`} className="flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground">{link.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
