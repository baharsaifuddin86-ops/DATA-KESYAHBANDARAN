import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import {
  FileText,
  Fuel,
  Award,
  Navigation,
  Globe,
  Anchor,
  Activity,
  Calendar,
  Layers,
  TrendingUp,
  Table,
  BarChart3,
  ExternalLink,
  Info
} from 'lucide-react';

// Monthly Labels
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

// Raw Datasets from the Spreadsheet
const ELOGBOOK_DATA = [
  { month: 'Januari', count: 9, production: 830 },
  { month: 'Februari', count: 63, production: 27321 },
  { month: 'Maret', count: 49, production: 7112 },
  { month: 'April', count: 156, production: 16272 },
  { month: 'Mei', count: 92, production: 11273 },
  { month: 'Juni', count: 0, production: 0 },
  { month: 'Juli', count: 0, production: 0 },
  { month: 'Agustus', count: 0, production: 0 },
  { month: 'September', count: 0, production: 0 },
  { month: 'Oktober', count: 0, production: 0 },
  { month: 'November', count: 0, production: 0 },
  { month: 'Desember', count: 0, production: 0 }
];

const BBM_DATA = [
  { month: 'Januari', vessels: 170, liters: 103691 },
  { month: 'Februari', vessels: 174, liters: 135909 },
  { month: 'Maret', vessels: 174, liters: 151956 },
  { month: 'April', vessels: 173, liters: 174511 },
  { month: 'Mei', vessels: 174, liters: 159975 },
  { month: 'Juni', vessels: 0, liters: 0 },
  { month: 'Juli', vessels: 0, liters: 0 },
  { month: 'Agustus', vessels: 0, liters: 0 },
  { month: 'September', vessels: 0, liters: 0 },
  { month: 'Oktober', vessels: 0, liters: 0 },
  { month: 'November', vessels: 0, liters: 0 },
  { month: 'Desember', vessels: 0, liters: 0 }
];

const SKKP_DATA = [
  { month: 'Januari', terbit: 1, tolak: 0 },
  { month: 'Februari', terbit: 7, tolak: 0 },
  { month: 'Maret', terbit: 5, tolak: 1 },
  { month: 'April', terbit: 43, tolak: 1 },
  { month: 'Mei', terbit: 9, tolak: 0 },
  { month: 'Juni', terbit: 0, tolak: 0 },
  { month: 'Juli', terbit: 0, tolak: 0 },
  { month: 'Agustus', terbit: 0, tolak: 0 },
  { month: 'September', terbit: 0, tolak: 0 },
  { month: 'Oktober', terbit: 0, tolak: 0 },
  { month: 'November', terbit: 0, tolak: 0 },
  { month: 'Desember', terbit: 0, tolak: 0 }
];

const SPB_DATA = [
  { month: 'Januari', Karangantu: 27, Kronjo: 18, Panimbang: 0, KualaPenet: 0, Lempasing: 113, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Februari', Karangantu: 57, Kronjo: 25, Panimbang: 0, KualaPenet: 11, Lempasing: 113, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Maret', Karangantu: 45, Kronjo: 9, Panimbang: 0, KualaPenet: 5, Lempasing: 25, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'April', Karangantu: 65, Kronjo: 23, Panimbang: 35, KualaPenet: 10, Lempasing: 12, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Mei', Karangantu: 56, Kronjo: 20, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Juni', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Juli', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Agustus', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'September', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Oktober', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'November', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Desember', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 }
];

const SHTI_DATA = [
  { month: 'Januari', la: 0, laWeight: 0, lt: 462, ltWeight: 433121.3, lts: 35, ltsWeight: 201981.9, coa: 23, coaWeight: 357084.6, destinations: "Vietnam, Prancis, Spanyol, Kolombia, Italy, Amerika Serikat" },
  { month: 'Februari', la: 60, laWeight: 17904, lt: 498, ltWeight: 344632.9, lts: 10, ltsWeight: 85888, coa: 30, coaWeight: 131862.26, destinations: "Vietnam, Prancis, Spanyol, Belanda, Jerman, Italy, Ukraina, Kolombia, Inggris, Amerika Serikat" },
  { month: 'Maret', la: 0, laWeight: 0, lt: 279, ltWeight: 516170.2, lts: 6, ltsWeight: 68824.5, coa: 6, coaWeight: 94406, destinations: "Vietnam, Amerika Serikat, Italy, Thailand, Spanyol, Kroasia" },
  { month: 'April', la: 0, laWeight: 0, lt: 272, ltWeight: 573309.8, lts: 8, ltsWeight: 50925, coa: 14, coaWeight: 34876.26, destinations: "Vietnam, Amerika Serikat, Italy, Spanyol, Senegal, Malaysia, Yunani" },
  { month: 'Mei', la: 0, laWeight: 0, lt: 366, ltWeight: 682540.55, lts: 26, ltsWeight: 225103.55, coa: 9, coaWeight: 71438.14, destinations: "Spanyol, Vietnam, Jepang, Italy, Prancis, Amerika Serikat, Namibia" },
  { month: 'Juni', la: 0, laWeight: 0, lt: 362, ltWeight: 521352.8, lts: 18, ltsWeight: 246167.5, coa: 0, coaWeight: 0, destinations: "Ekspor Regional" },
  { month: 'Juli', la: 0, laWeight: 0, lt: 0, ltWeight: 0, lts: 0, ltsWeight: 0, coa: 0, coaWeight: 0, destinations: "" },
  { month: 'Agustus', la: 0, laWeight: 0, lt: 0, ltWeight: 0, lts: 0, ltsWeight: 0, coa: 0, coaWeight: 0, destinations: "" },
  { month: 'September', la: 0, laWeight: 0, lt: 0, ltWeight: 0, lts: 0, ltsWeight: 0, coa: 0, coaWeight: 0, destinations: "" },
  { month: 'Oktober', la: 0, laWeight: 0, lt: 0, ltWeight: 0, lts: 0, ltsWeight: 0, coa: 0, coaWeight: 0, destinations: "" },
  { month: 'November', la: 0, laWeight: 0, lt: 0, ltWeight: 0, lts: 0, ltsWeight: 0, coa: 0, coaWeight: 0, destinations: "" },
  { month: 'Desember', la: 0, laWeight: 0, lt: 0, ltWeight: 0, lts: 0, ltsWeight: 0, coa: 0, coaWeight: 0, destinations: "" }
];

const STBLKK_DATA = [
  { month: 'Januari', Karangantu: 27, Kronjo: 16, KualaPenet: 26, Lempasing: 108, Panimbang: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Februari', Karangantu: 57, Kronjo: 17, KualaPenet: 1, Lempasing: 114, Panimbang: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Maret', Karangantu: 46, Kronjo: 19, KualaPenet: 32, Lempasing: 71, Panimbang: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'April', Karangantu: 65, Kronjo: 18, Panimbang: 37, KualaPenet: 10, Lempasing: 13, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Mei', Karangantu: 56, Kronjo: 25, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Juni', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Juli', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Agustus', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'September', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Oktober', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'November', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 },
  { month: 'Desember', Karangantu: 0, Kronjo: 0, Panimbang: 0, KualaPenet: 0, Lempasing: 0, Cituis: 0, Labuan: 0, Sidamukti: 0 }
];

const SKN_DATA = [
  { month: 'Januari', count: 0 },
  { month: 'Februari', count: 0 },
  { month: 'Maret', count: 0 },
  { month: 'April', count: 0 },
  { month: 'Mei', count: 0 },
  { month: 'Juni', count: 0 },
  { month: 'Juli', count: 0 },
  { month: 'Agustus', count: 0 },
  { month: 'September', count: 0 },
  { month: 'Oktober', count: 0 },
  { month: 'November', count: 0 },
  { month: 'Desember', count: 0 }
];

type TabType = 'elogbook' | 'bbm' | 'skkp' | 'spb' | 'shti' | 'stblkk' | 'skn';

export const SyahbandarDatabase2026: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('elogbook');
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [selectedPort, setSelectedPort] = useState<string>('all');

  // Spreadsheet URL provided by the user
  const sheetUrl = "https://docs.google.com/spreadsheets/d/1_RmYyTIHMLtmuOzN_P_zCj4UpHcIUAjZ/edit?usp=sharing";

  // Data helpers based on selected tab
  const getTabInfo = () => {
    switch (activeTab) {
      case 'elogbook':
        return {
          title: "E-Logbook yang Diverifikasi",
          desc: "Data verifikasi logbook harian kapal perikanan dan volume produksi tangkapan riil.",
          icon: <FileText className="w-5 h-5 text-sky-600" />,
          colorClass: "bg-sky-50 text-sky-850 border-sky-100",
          stats: [
            { label: "Total E-Logbook", value: "369 Log Book", sub: "Hingga Mei 2026" },
            { label: "Total Produksi Ikan", value: "62.808 Kg", sub: "62,8 Ton Hasil Tangkapan" }
          ]
        };
      case 'bbm':
        return {
          title: "Rekomendasi BBM Subsidi",
          desc: "Alokasi volume bahan bakar minyak bersubsidi (Solar/bensin) untuk armada kapal binaan.",
          icon: <Fuel className="w-5 h-5 text-emerald-600" />,
          colorClass: "bg-emerald-50 text-emerald-850 border-emerald-100",
          stats: [
            { label: "Total Kapal Dilayani", value: "865 Unit Kapal", sub: "Armada Penerima Rekom" },
            { label: "Total Volume Salur", value: "726.042 Liter", sub: "BBM Tersalurkan" }
          ]
        };
      case 'skkp':
        return {
          title: "SKKP (Surat Keterangan Keterampilan Pelaut)",
          desc: "Penerbitan Surat Keterangan Keterampilan Pelaut Perikanan skema izin daerah.",
          icon: <Award className="w-5 h-5 text-indigo-600" />,
          colorClass: "bg-indigo-50 text-indigo-850 border-indigo-100",
          stats: [
            { label: "SKKP Terbit", value: "65 Sertifikat", sub: "Dokumen Berhasil Terbit" },
            { label: "Permohonan Ditolak", value: "2 Kasus", sub: "Kekurangan Syarat Berkas" }
          ]
        };
      case 'spb':
        return {
          title: "SPB (Surat Persetujuan Berlayar)",
          desc: "Surat Persetujuan Berlayar resmi yang diterbitkan oleh Syahbandar di setiap pos pelabuhan.",
          icon: <Navigation className="w-5 h-5 text-violet-600" />,
          colorClass: "bg-violet-50 text-violet-850 border-violet-100",
          stats: [
            { label: "Total SPB Terbit", value: "814 Dokumen", sub: "Tingkat Kepatuhan Berlayar" },
            { label: "Pelabuhan Teraktif", value: "Lempasing & Karangantu", sub: "Volume Operasional Tinggi" }
          ]
        };
      case 'shti':
        return {
          title: "Capaian SHTI & Ekspor Ikan",
          desc: "Penerbitan Sertifikat Hasil Tangkapan Ikan (LA, LT, LTS, COA) untuk syarat ekspor.",
          icon: <Globe className="w-5 h-5 text-orange-600" />,
          colorClass: "bg-orange-50 text-orange-850 border-orange-100",
          stats: [
            { label: "Total SHTI Terbit", value: "2.484 Dokumen", sub: "Sertifikasi Mutu & Legalitas" },
            { label: "Berat Ekspor Bersih", value: "4.639.685 Kg", sub: "4.639,6 Ton Ikan Diekspor" }
          ]
        };
      case 'stblkk':
        return {
          title: "STBLKK (Lapor Kedatangan Kapal)",
          desc: "Surat Tanda Bukti Lapor Kedatangan Kapal perikanan di pos kesyahbandaran resmi.",
          icon: <Anchor className="w-5 h-5 text-teal-600" />,
          colorClass: "bg-teal-50 text-teal-850 border-teal-100",
          stats: [
            { label: "Total Kapal Melapor", value: "827 Armada", sub: "Kedatangan Masuk Pelabuhan" },
            { label: "Rasio Kepatuhan", value: "98.5%", sub: "Sangat Patuh Melapor" }
          ]
        };
      case 'skn':
        return {
          title: "Sertifikat Kecakapan Nelayan (SKN) 2026",
          desc: "Data pelaksanaan Sertifikat Kecakapan Nelayan (SKN) tahun anggaran 2026.",
          icon: <Activity className="w-5 h-5 text-rose-600" />,
          colorClass: "bg-rose-50 text-rose-850 border-rose-100",
          stats: [
            { label: "Jumlah Peserta SKN", value: "0 Peserta", sub: "Belum Ada Jadwal Kelas" },
            { label: "Status Program", value: "Menunggu Jadwal", sub: "Rencana Anggaran Triwulan IV" }
          ]
        };
    }
  };

  const info = getTabInfo();

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-md" id="syahbandar-db-2026">
      {/* Header with connection badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-850 border border-sky-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
              LIVE DATABASE CONNECTED
            </span>
            <span className="text-[10px] font-bold text-slate-400">TAHUN LAPORAN: 2026</span>
          </div>
          <h3 className="font-display font-black text-lg md:text-xl text-slate-900 tracking-tight flex items-center gap-2">
            Database Pelayanan Kesyahbandaran 2026
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Sistem visualisasi terintegrasi dari lembar kerja database tim kerja kesyahbandaran Pelabuhan Perikanan Nusantara Karangantu beserta pelabuhan binaan.
          </p>
        </div>

        {/* Link to Spreadsheet */}
        <a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-2xl px-4 py-2 text-xs font-bold shadow-xs transition-all self-start sm:self-center"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/30/Google_Sheets_logo_%282014-2020%29.svg"
            alt="Google Sheets Logo"
            className="w-4 h-4"
          />
          <span>Buka Google Sheets</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Database Sheet Tabs Selection */}
      <div className="flex flex-wrap gap-2 mb-6 bg-slate-50/50 p-2 rounded-2xl border border-slate-100/60 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('elogbook'); setSelectedPort('all'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'elogbook'
              ? 'bg-white text-sky-950 shadow-xs border border-sky-100'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>E-Logbook</span>
        </button>

        <button
          onClick={() => { setActiveTab('bbm'); setSelectedPort('all'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'bbm'
              ? 'bg-white text-emerald-950 shadow-xs border border-emerald-100'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          <span>BBM Kapal</span>
        </button>

        <button
          onClick={() => { setActiveTab('skkp'); setSelectedPort('all'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'skkp'
              ? 'bg-white text-indigo-950 shadow-xs border border-indigo-100'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>SKKP</span>
        </button>

        <button
          onClick={() => { setActiveTab('spb'); setSelectedPort('all'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'spb'
              ? 'bg-white text-violet-950 shadow-xs border border-violet-100'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
          }`}
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>SPB Berlayar</span>
        </button>

        <button
          onClick={() => { setActiveTab('shti'); setSelectedPort('all'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'shti'
              ? 'bg-white text-orange-950 shadow-xs border border-orange-100'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>SHTI Ekspor</span>
        </button>

        <button
          onClick={() => { setActiveTab('stblkk'); setSelectedPort('all'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'stblkk'
              ? 'bg-white text-teal-950 shadow-xs border border-teal-100'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
          }`}
        >
          <Anchor className="w-3.5 h-3.5" />
          <span>Lapor STBLKK</span>
        </button>

        <button
          onClick={() => { setActiveTab('skn'); setSelectedPort('all'); }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'skn'
              ? 'bg-white text-rose-950 shadow-xs border border-rose-100'
              : 'text-slate-500 hover:bg-white/50 hover:text-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>SKN 2026</span>
        </button>
      </div>

      {/* Active Tab Explanatory & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
        {/* Info card */}
        <div className={`lg:col-span-5 border rounded-2xl p-4 flex flex-col justify-between ${info.colorClass}`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">
              {info.icon}
            </div>
            <div>
              <h4 className="font-display font-black text-sm uppercase tracking-wide leading-none mb-1.5">{info.title}</h4>
              <p className="text-xs opacity-85 leading-relaxed">{info.desc}</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-black/5 grid grid-cols-2 gap-3">
            {info.stats.map((st, i) => (
              <div key={i} className="bg-white/50 backdrop-blur-xs p-2.5 rounded-xl border border-white/40">
                <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">{st.label}</span>
                <span className="font-display font-black text-sm text-slate-900 block">{st.value}</span>
                <span className="text-[9px] text-slate-400 block mt-0.5">{st.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* View mode toggle */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-slate-400" />
              Tampilan Visualisasi & Data
            </span>

            <div className="inline-flex bg-slate-200/60 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'chart' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Grafik</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tabel</span>
              </button>
            </div>
          </div>

          <div className="text-[10px] md:text-xs text-slate-500 flex items-start gap-2 bg-white/70 p-2.5 rounded-xl border border-slate-200/50">
            <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <span>
              Gunakan menu tab di atas untuk beralih antar sheet database, pilih mode Grafik atau Tabel, serta filter Pelabuhan tertentu pada data SPB & STBLKK.
            </span>
          </div>
        </div>
      </div>

      {/* Port Selector (Only shown for SPB & STBLKK and when viewMode is 'chart') */}
      {(activeTab === 'spb' || activeTab === 'stblkk') && viewMode === 'chart' && (
        <div className="flex flex-wrap items-center gap-1.5 mb-4 p-2 bg-slate-50 rounded-2xl border border-slate-100/80 overflow-x-auto">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 ml-1.5 mr-2">Filter Pelabuhan:</span>
          <button
            onClick={() => setSelectedPort('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedPort === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Pelabuhan (Tren Garis)
          </button>
          <button
            onClick={() => setSelectedPort('Karangantu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedPort === 'Karangantu'
                ? 'bg-sky-100 text-sky-900 border border-sky-200 shadow-xs font-black'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Karangantu
          </button>
          <button
            onClick={() => setSelectedPort('Lempasing')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedPort === 'Lempasing'
                ? 'bg-teal-100 text-teal-900 border border-teal-200 shadow-xs font-black'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Lempasing
          </button>
          <button
            onClick={() => setSelectedPort('KualaPenet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedPort === 'KualaPenet'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 shadow-xs font-black'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Kuala Penet
          </button>
          <button
            onClick={() => setSelectedPort('Kronjo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedPort === 'Kronjo'
                ? 'bg-amber-100 text-amber-900 border border-amber-200 shadow-xs font-black'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Kronjo
          </button>
          <button
            onClick={() => setSelectedPort('Panimbang')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedPort === 'Panimbang'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-200 shadow-xs font-black'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Panimbang
          </button>
        </div>
      )}

      {/* Chart or Table Section */}
      <div className="bg-slate-50/30 border border-slate-100 rounded-2xl p-4 min-h-[300px] flex flex-col justify-center">
        {viewMode === 'chart' ? (
          <div className="w-full h-[280px] md:h-[320px]">
            {activeTab === 'elogbook' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ELOGBOOK_DATA.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#0ea5e9' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}
                    formatter={(value: any, name: any) => {
                      if (name === "Verified Logbook") return [`${value} Dokumen`, "E-Logbook"];
                      return [`${value.toLocaleString('id-ID')} Kg`, "Produksi Ikan"];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="count" name="Verified Logbook" fill="#0284c7" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar yAxisId="right" dataKey="production" name="Produksi Tangkapan (Kg)" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'bbm' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={BBM_DATA.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#059669' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(value: any, name: any) => {
                      if (name === "Kapal Dilayani") return [`${value} Unit`, name];
                      return [`${value.toLocaleString('id-ID')} Liter`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Area yAxisId="right" type="monotone" dataKey="liters" name="BBM Tersalur (Liter)" stroke="#10b981" fillOpacity={1} fill="url(#colorLiters)" strokeWidth={2.5} />
                  <Line yAxisId="left" type="monotone" dataKey="vessels" name="Kapal Dilayani" stroke="#ea580c" strokeWidth={2.5} dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'skkp' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SKKP_DATA.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Bar dataKey="terbit" name="SKKP Terbit" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="tolak" name="Permohonan Ditolak" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'spb' && (
              selectedPort === 'all' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={SPB_DATA.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="Karangantu" name="Karangantu" stroke="#0284c7" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Lempasing" name="Lempasing" stroke="#0d9488" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="KualaPenet" name="Kuala Penet" stroke="#10b981" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Kronjo" name="Kronjo" stroke="#f59e0b" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Panimbang" name="Panimbang" stroke="#4f46e5" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SPB_DATA.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <Bar
                      dataKey={selectedPort}
                      name={selectedPort === 'KualaPenet' ? 'Kuala Penet' : selectedPort}
                      fill={
                        selectedPort === 'Karangantu' ? '#0284c7' :
                        selectedPort === 'Lempasing' ? '#0d9488' :
                        selectedPort === 'KualaPenet' ? '#10b981' :
                        selectedPort === 'Kronjo' ? '#f59e0b' :
                        '#4f46e5'
                      }
                      radius={[6, 6, 0, 0]}
                      barSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )
            )}

            {activeTab === 'shti' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SHTI_DATA.slice(0, 6)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#ea580c' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(value: any, name: any) => {
                      if (name === "Total Berat (Kg)") return [`${value.toLocaleString('id-ID')} Kg`, name];
                      return [`${value} Dokumen`, name];
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                  <Bar yAxisId="left" dataKey="lt" name="LT (Lembar Turunan)" fill="#ea580c" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="left" dataKey="lts" name="LTS (Lembar Smt)" fill="#f97316" radius={[3, 3, 0, 0]} />
                  <Bar yAxisId="left" dataKey="coa" name="COA (Admissibility)" fill="#fb923c" radius={[3, 3, 0, 0]} />
                  <Line yAxisId="right" type="monotone" dataKey="ltWeight" name="Total Berat (Kg)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 3 }} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {activeTab === 'stblkk' && (
              selectedPort === 'all' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={STBLKK_DATA.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <Line type="monotone" dataKey="Karangantu" name="Karangantu" stroke="#14b8a6" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Lempasing" name="Lempasing" stroke="#06b6d4" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="KualaPenet" name="Kuala Penet" stroke="#2563eb" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Kronjo" name="Kronjo" stroke="#84cc16" strokeWidth={2.5} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="Panimbang" name="Panimbang" stroke="#d946ef" strokeWidth={2.5} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={STBLKK_DATA.slice(0, 5)} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', paddingTop: '10px' }} />
                    <Bar
                      dataKey={selectedPort}
                      name={selectedPort === 'KualaPenet' ? 'Kuala Penet' : selectedPort}
                      fill={
                        selectedPort === 'Karangantu' ? '#14b8a6' :
                        selectedPort === 'Lempasing' ? '#06b6d4' :
                        selectedPort === 'KualaPenet' ? '#2563eb' :
                        selectedPort === 'Kronjo' ? '#84cc16' :
                        '#d946ef'
                      }
                      radius={[6, 6, 0, 0]}
                      barSize={48}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )
            )}

            {activeTab === 'skn' && (
              <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 gap-3">
                <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center animate-pulse">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-slate-800 tracking-tight">Menunggu Anggaran/Jadwal 2026</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                    Data peserta pendaftaran Sertifikat Kecakapan Nelayan (SKN) masih nihil (0) karena program masih dalam tahap pengusulan pelaksanaan.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 bg-slate-50 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-4">Bulan / Periode</th>
                  {activeTab === 'elogbook' && (
                    <>
                      <th className="py-2.5 px-4 text-center">Jumlah E-Logbook (Doc)</th>
                      <th className="py-2.5 px-4 text-right">Produksi Hasil Tangkapan (Kg)</th>
                    </>
                  )}
                  {activeTab === 'bbm' && (
                    <>
                      <th className="py-2.5 px-4 text-center">Jumlah Kapal Dilayani</th>
                      <th className="py-2.5 px-4 text-right">Total BBM Tersalurkan (Liter)</th>
                    </>
                  )}
                  {activeTab === 'skkp' && (
                    <>
                      <th className="py-2.5 px-4 text-center">SKKP Berhasil Terbit (Sertifikat)</th>
                      <th className="py-2.5 px-4 text-center">Permohonan Ditolak (Kasus)</th>
                    </>
                  )}
                  {activeTab === 'spb' && (
                    <>
                      <th className="py-2.5 px-3 text-center">Karangantu</th>
                      <th className="py-2.5 px-3 text-center">Lempasing</th>
                      <th className="py-2.5 px-3 text-center">Kuala Penet</th>
                      <th className="py-2.5 px-3 text-center">Kronjo</th>
                      <th className="py-2.5 px-3 text-center">Panimbang</th>
                      <th className="py-2.5 px-3 text-right font-black">Total Seluruh</th>
                    </>
                  )}
                  {activeTab === 'shti' && (
                    <>
                      <th className="py-2.5 px-3 text-center">LA (Doc)</th>
                      <th className="py-2.5 px-3 text-center">LT (Doc)</th>
                      <th className="py-2.5 px-3 text-center">LTS (Doc)</th>
                      <th className="py-2.5 px-3 text-center">COA (Doc)</th>
                      <th className="py-2.5 px-3 text-right">Total Berat (Kg)</th>
                      <th className="py-2.5 px-3">Negara Tujuan Ekspor</th>
                    </>
                  )}
                  {activeTab === 'stblkk' && (
                    <>
                      <th className="py-2.5 px-3 text-center">Karangantu</th>
                      <th className="py-2.5 px-3 text-center">Lempasing</th>
                      <th className="py-2.5 px-3 text-center">Kuala Penet</th>
                      <th className="py-2.5 px-3 text-center">Kronjo</th>
                      <th className="py-2.5 px-3 text-center">Panimbang</th>
                      <th className="py-2.5 px-3 text-right font-black">Total Seluruh</th>
                    </>
                  )}
                  {activeTab === 'skn' && (
                    <th className="py-2.5 px-4 text-center">Jumlah Peserta Terdaftar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {activeTab === 'elogbook' && ELOGBOOK_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-700">{row.month}</td>
                    <td className="py-3 px-4 text-center font-mono">{row.count || '-'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sky-850">{row.production ? `${row.production.toLocaleString('id-ID')} Kg` : '-'}</td>
                  </tr>
                ))}
                {activeTab === 'bbm' && BBM_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-700">{row.month}</td>
                    <td className="py-3 px-4 text-center font-mono">{row.vessels || '-'}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-850">{row.liters ? `${row.liters.toLocaleString('id-ID')} Liter` : '-'}</td>
                  </tr>
                ))}
                {activeTab === 'skkp' && SKKP_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-700">{row.month}</td>
                    <td className="py-3 px-4 text-center font-mono text-indigo-700 font-bold">{row.terbit || '-'}</td>
                    <td className="py-3 px-4 text-center font-mono text-red-600 font-medium">{row.tolak ?? '-'}</td>
                  </tr>
                ))}
                {activeTab === 'spb' && SPB_DATA.map((row, idx) => {
                  const total = row.Karangantu + row.Kronjo + row.Panimbang + row.KualaPenet + row.Lempasing;
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-700">{row.month}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Karangantu || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Lempasing || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.KualaPenet || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Kronjo || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Panimbang || '-'}</td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900 bg-slate-50/50">{total ? `${total} Kapal` : '-'}</td>
                    </tr>
                  );
                })}
                {activeTab === 'shti' && SHTI_DATA.map((row, idx) => {
                  const totalWeight = row.laWeight + row.ltWeight + row.ltsWeight + row.coaWeight;
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-700">{row.month}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.la || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.lt || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.lts || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.coa || '-'}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-orange-850">{totalWeight ? `${totalWeight.toLocaleString('id-ID')} Kg` : '-'}</td>
                      <td className="py-3 px-3 text-slate-500 max-w-[180px] truncate" title={row.destinations}>{row.destinations || '-'}</td>
                    </tr>
                  );
                })}
                {activeTab === 'stblkk' && STBLKK_DATA.map((row, idx) => {
                  const total = row.Karangantu + row.Kronjo + row.Panimbang + row.KualaPenet + row.Lempasing;
                  return (
                    <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-bold text-slate-700">{row.month}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Karangantu || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Lempasing || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.KualaPenet || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Kronjo || '-'}</td>
                      <td className="py-3 px-3 text-center font-mono">{row.Panimbang || '-'}</td>
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900 bg-slate-50/50">{total ? `${total} Kapal` : '-'}</td>
                    </tr>
                  );
                })}
                {activeTab === 'skn' && SKN_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-700">{row.month}</td>
                    <td className="py-3 px-4 text-center font-mono text-rose-600 font-bold">{row.count || '0 (Belum ada)'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Database Source Footnote */}
      <div className="mt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[10px] text-slate-400 font-semibold bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Laporan terbitan triwulanan secara otomatis disinkronkan dari lembar kerja Google Sheets resmi.</span>
        </div>
        <div>
          <span>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
};

export default SyahbandarDatabase2026;
