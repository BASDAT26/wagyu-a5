import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Menu, X, ChevronDown } from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "@/components/mode-toggle";
import { ADMIN_LINKS, CUSTOMER_LINKS, GUEST_LINKS, ORGANIZER_LINKS, type NavItem } from "./const";
import type { Role } from "@/data/type";

function getLinks(role?: Role): NavItem[] {
  if (role === "ADMIN") return ADMIN_LINKS;
  if (role === "ORGANIZER") return ORGANIZER_LINKS;
  if (role === "CUSTOMER") return CUSTOMER_LINKS;
  return GUEST_LINKS;
}

function NavMenu({ to, label, onClick }: NavItem & { onClick?: () => void }) {
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

interface NavbarProps {
  role?: Role;
}

export default function Navbar({ role: propRole }: NavbarProps) {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isLoggedIn = !!session;
  const role = (session?.user as { role?: Role })?.role ?? propRole;
  const links = getLinks(role);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/");
          setUserMenuOpen(false);
          setMobileOpen(false);
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
        {/* ── Brand ── */}
        <NavLink
          to="/"
          className="flex items-center gap-2 text-base font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity"
        >
          <span className="hidden sm:inline">wagyu-a5</span>
        </NavLink>

        {/* ── Desktop nav ── */}
        <nav className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
          {links.map((link) => (
            <NavMenu key={`${link.to}-${link.label}`} {...link} />
          ))}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">
          <ModeToggle />

          {/* Role badge (skeleton while loading) */}
          {isPending ? (
            <span className="h-8 w-20 animate-pulse rounded-md bg-muted" />
          ) : isLoggedIn ? (
            /* User dropdown */
            <div className="relative">
              <button
                id="user-menu-trigger"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                <span className="max-w-30 truncate">{session.user.name}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-lg border border-border bg-card shadow-lg py-1 z-50 animate-in fade-in-0 zoom-in-95">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {role?.toLowerCase() ?? "user"}
                    </p>
                    <p className="text-sm font-medium truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="block px-3 py-2 text-sm hover:bg-accent transition-colors"
                  >
                    Profile
                  </NavLink>
                  <button
                    id="sign-out-btn"
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
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
            <NavMenu
              key={`mobile-${link.to}-${link.label}`}
              {...link}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          {isLoggedIn && (
            <button
              onClick={handleSignOut}
              className="mt-1 text-left px-3 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
