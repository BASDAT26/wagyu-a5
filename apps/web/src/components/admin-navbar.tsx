import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X, ChevronDown } from "lucide-react";

import { ModeToggle } from "./mode-toggle";

// ---------------------------------------------------------------------------
// Route definitions per role
// ---------------------------------------------------------------------------

type NavItem = { to: string; label: string };

const ADMIN_LINKS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/venue", label: "Manajemen Venue" },
  { to: "/seat", label: "Manajemen Kursi" },
  { to: "/ticket-category", label: "Kategori Tiket" },
  { to: "/ticket", label: "Manajemen Tiket" },
  { to: "/order", label: "Semua Order" },
  { to: "/tiket-aset", label: "Tiket (Aset)" },
  { to: "/order-aset", label: "Order (Aset)" },
  { to: "/profile", label: "Profile" },
];

// ---------------------------------------------------------------------------
// NavLink item component
// ---------------------------------------------------------------------------

function NavItem({ to, label, onClick }: NavItem & { onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      end
      onClick={onClick}
      className={({ isActive }) =>
        [
          "relative px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          "hover:bg-accent hover:text-accent-foreground",
          isActive
            ? "text-primary font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:bg-primary after:rounded-full"
            : "text-muted-foreground",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  );
}

// ---------------------------------------------------------------------------
// Main AdminNavbar component
// ---------------------------------------------------------------------------

export default function AdminNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const links = ADMIN_LINKS;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-4 sm:px-6">
        {/* ── Brand ── */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-primary text-primary-foreground text-xs font-black">
            W
          </span>
          <span className="hidden sm:inline">wagyu-a5</span>
        </NavLink>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto px-4">
          {links.map((link) => (
            <NavItem key={`${link.to}-${link.label}`} {...link} />
          ))}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* User dropdown mockup for Admin */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setUserMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <span className="max-w-[120px] truncate">Admin User</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    admin
                  </p>
                  <p className="text-sm font-medium truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@wagyu.com</p>
                </div>
                <NavLink
                  to="/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-3 py-2 text-sm hover:bg-accent transition-colors"
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => setUserMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden rounded-md p-1.5 hover:bg-accent transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile nav ── */}
      {mobileOpen && (
        <nav className="lg:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1 animate-in slide-in-from-top-2">
          {links.map((link) => (
            <NavItem
              key={`mobile-${link.to}-${link.label}`}
              {...link}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          <button
            onClick={() => setMobileOpen(false)}
            className="mt-1 text-left px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            Logout
          </button>
        </nav>
      )}
    </header>
  );
}
