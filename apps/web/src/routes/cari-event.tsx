import { Calendar, MapPin, Tag, ChevronRight, Music, Theater, Mic2 } from "lucide-react";
import { Link } from "react-router";
import Header from "@/components/header";

// --- Mock Data ---
const EVENTS = [
  {
    id: "evt_1",
    title: "Konser Sheila On 7 - Tunggu Aku Di Jakarta",
    date: "24 Agustus 2024",
    location: "Gelora Bung Karno, Jakarta",
    price: "Mulai dari Rp 500.000",
    category: "Musik",
    icon: Music,
    color: "bg-blue-500",
    image: "https://images.unsplash.com/photo-1540039155733-d7696d4eb98b?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "evt_2",
    title: "Stand Up Comedy: Pandji Pragiwaksono",
    date: "15 September 2024",
    location: "Jakarta Convention Center",
    price: "Mulai dari Rp 350.000",
    category: "Komedi",
    icon: Mic2,
    color: "bg-amber-500",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "evt_3",
    title: "Teater Laskar Pelangi",
    date: "02 November 2024",
    location: "Ciputra Artpreneur, Jakarta",
    price: "Mulai dari Rp 750.000",
    category: "Seni Pertunjukan",
    icon: Theater,
    color: "bg-rose-500",
    image: "https://images.unsplash.com/photo-1507676184212-d0330a151f96?q=80&w=600&auto=format&fit=crop",
  },
];

export default function CariEventPage() {
  return (
    <>
      <Header role="customer" />
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100">Temukan Event Impianmu</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              Eksplorasi ribuan konser, pertunjukan seni, dan acara menarik lainnya di sekitarmu. Beli tiket dengan mudah dan aman.
            </p>
            
            {/* Search Bar */}
            <div className="flex items-center gap-3 mt-6 bg-slate-100 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 w-full max-w-xl">
              <input 
                type="text" 
                placeholder="Cari nama event, artis, atau lokasi..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-300 px-4 placeholder:text-slate-400"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all">
                Cari
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {["Semua Kategori", "Musik", "Seni Pertunjukan", "Komedi", "Olahraga", "Seminar"].map((cat, i) => (
            <button 
              key={cat}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                i === 0 
                  ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 shadow-md" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {EVENTS.map((evt) => (
            <div key={evt.id} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group flex flex-col">
              
              {/* Image cover */}
              <div className="h-52 w-full relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                <img src={evt.image} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <evt.icon size={14} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{evt.category}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 line-clamp-2">{evt.title}</h3>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="text-sm font-medium">{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                    <MapPin size={16} className="text-rose-500" />
                    <span className="text-sm font-medium truncate">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                    <Tag size={16} className="text-emerald-500" />
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{evt.price}</span>
                  </div>
                </div>

                <Link 
                  to={`/checkout?eventId=${evt.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-400 py-3.5 rounded-2xl font-bold transition-all group/btn"
                >
                  Beli Tiket
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
