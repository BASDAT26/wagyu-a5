export type NavItem = { to: string; label: string };

export const GUEST_LINKS: NavItem[] = [
  { to: "/login", label: "Login" },
  { to: "/register", label: "Registrasi" },
];

export const ADMIN_LINKS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/event", label: "Event Saya" },
  { to: "/venue", label: "Manajemen Venue" },
  { to: "/seat", label: "Manajemen Kursi" },
  { to: "/artist", label: "Manajemen Artis" },
  { to: "/ticket", label: "Manajemen Tiket" },
  { to: "/ticket-category", label: "Kategori Tiket" },
  { to: "/promotion", label: "Promosi" },
  { to: "/order", label: "Semua Order" },
  { to: "/profile", label: "Profile" },
];

export const ORGANIZER_LINKS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/event", label: "Event Saya" },
  { to: "/venue", label: "Manajemen Venue" },
  { to: "/seat", label: "Manajemen Kursi" },
  { to: "/artist", label: "Manajemen Artis" },
  { to: "/ticket", label: "Manajemen Tiket" },
  { to: "/ticket-category", label: "Kategori Tiket" },
  { to: "/promotion", label: "Promosi" },
  { to: "/order", label: "Semua Order" },
  { to: "/profile", label: "Profile" },
];

export const CUSTOMER_LINKS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/ticket", label: "Tiket Saya" },
  { to: "/order", label: "Pesanan" },
  { to: "/event", label: "Cari Event" },
  { to: "/promosi", label: "Promosi" },
  { to: "/venue", label: "Venue" },
  { to: "/artist", label: "Artis" },
];
