import { Port, PortClass } from '../types';
import { 
  Anchor, 
  MapPin, 
  Calendar, 
  User, 
  Box, 
  Ship, 
  CheckCircle2, 
  Tag, 
  Layers, 
  Copy, 
  Check, 
  Compass, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface PortDetailCardProps {
  port: Port | null;
  onEditClick: (port: Port) => void;
}

export default function PortDetailCard({ port, onEditClick }: PortDetailCardProps) {
  const [copied, setCopied] = useState(false);

  if (!port) {
    return (
      <div className="w-full h-full bg-white border border-sky-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 shadow-md">
        <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 animate-pulse">
          <Compass className="w-8 h-8" />
        </div>
        <div className="max-w-xs">
          <h3 className="font-display font-bold text-base text-sky-950 tracking-tight">Pilih Pelabuhan Perikanan</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Klik salah satu penanda pelabuhan di peta atau pilih dari daftar di samping untuk melihat informasi detail, kapasitas produksi, sarana prasarana, dan statistik kapal.
          </p>
        </div>
      </div>
    );
  }

  // Copy coordinates to clipboard
  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${port.latitude}, ${port.longitude}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getClassLabel = (cls: PortClass) => {
    switch (cls) {
      case 'PPS': return 'Pelabuhan Perikanan Samudera (Tipe A)';
      case 'PPN': return 'Pelabuhan Perikanan Nusantara (Tipe B)';
      case 'PPP': return 'Pelabuhan Perikanan Pantai (Tipe C)';
      case 'PPI': return 'Pangkalan Pendaratan Ikan (Tipe D)';
    }
  };

  const getClassColor = (cls: PortClass) => {
    switch (cls) {
      case 'PPS': return 'bg-indigo-500/20 text-white border-indigo-300/30';
      case 'PPN': return 'bg-sky-500/20 text-white border-sky-300/30';
      case 'PPP': return 'bg-emerald-500/20 text-white border-emerald-300/30';
      case 'PPI': return 'bg-amber-500/20 text-white border-amber-300/30';
    }
  };

  // Vessel Breakdown Calculations
  const totalVesselBreakdown = port.vesselBreakdown.small + port.vesselBreakdown.medium + port.vesselBreakdown.large;
  const smallPct = totalVesselBreakdown > 0 ? Math.round((port.vesselBreakdown.small / totalVesselBreakdown) * 100) : 0;
  const medPct = totalVesselBreakdown > 0 ? Math.round((port.vesselBreakdown.medium / totalVesselBreakdown) * 100) : 0;
  const lgPct = totalVesselBreakdown > 0 ? Math.round((port.vesselBreakdown.large / totalVesselBreakdown) * 100) : 0;

  return (
    <div className="w-full h-full bg-white border border-sky-100 rounded-2xl shadow-md flex flex-col overflow-hidden animate-fadeIn">
      {/* Detail Card Header */}
      <div className={`p-6 text-white ${port.region === 'Banten' ? 'bg-gradient-to-r from-sky-500 to-blue-600' : 'bg-gradient-to-r from-teal-500 to-emerald-600'} border-b border-sky-100 relative shrink-0`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
        
        <div className="flex flex-col gap-2 relative">
          <div className="flex items-center justify-between gap-4">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold tracking-wide uppercase border ${getClassColor(port.class)}`}>
              {port.class}
            </span>
            <span className="text-[10px] font-semibold bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full text-white/90">
              Wilayah {port.region}
            </span>
          </div>

          <h2 className="font-display font-bold text-lg md:text-xl tracking-tight leading-tight mt-1.5 text-white">
            {port.name}
          </h2>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-white/90 mt-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 shrink-0 text-white/80" />
              <span>{port.district}, {port.region}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Description Section */}
        <div className="flex flex-col gap-1.5">
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Deskripsi Pelabuhan</h4>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-sky-100/50">
            {port.description}
          </p>
        </div>

        {/* Port Administration Detail Grid */}
        <div className="grid grid-cols-1 gap-4">
          <div className="border border-sky-100/60 bg-sky-50/30 rounded-xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-500">Klasifikasi Utama Pelabuhan</p>
              <p className="text-xs font-semibold text-slate-700 leading-tight mt-0.5">{getClassLabel(port.class)}</p>
            </div>
          </div>
        </div>

        {/* Syahbandar & Staff Section */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-sky-600" />
            Syahbandar & Petugas Kantor Syahbandar
          </h4>
          
          <div className="bg-sky-50/20 rounded-2xl p-4.5 border border-sky-100/80 flex flex-col gap-3">
            {port.syahbandarStaff && port.syahbandarStaff.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {port.syahbandarStaff.map((staff, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-xl border border-sky-100/50 flex flex-col gap-1 shadow-sm">
                    <span className="text-[9px] uppercase font-bold text-sky-700 tracking-wide bg-sky-50 px-2 py-0.5 rounded self-start">
                      {staff.position}
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-1">{staff.name}</span>
                    {staff.stay && (
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" /> Stay: {staff.stay}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic text-center py-2">Belum ada rincian petugas syahbandar khusus.</p>
            )}
          </div>
        </div>

        {/* Dynamic Dominant Fishing Gear Panel */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sky-600" />
            Alat Penangkap Ikan Dominan & Distribusi
          </h4>
          
          <div className="bg-sky-50/40 rounded-2xl p-5 border border-sky-100 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-xs text-slate-500">Alat Penangkap Utama</p>
                <div className="text-xl md:text-2xl font-display font-extrabold text-sky-950 mt-1">
                  {port.dominantFishingGear}
                </div>
              </div>

              <div className="text-xs text-slate-550 max-w-sm leading-relaxed border-t md:border-t-0 md:border-l border-sky-100 pt-3 md:pt-0 md:pl-5">
                Sebagian besar armada kapal aktif di pelabuhan ini mengoperasikan jenis alat tangkap <span className="font-semibold text-sky-900">{port.dominantFishingGear}</span> sebagai metode penangkapan komoditas utama.
              </div>
            </div>

            {/* Detailed Gear Breakdown Progress Bars */}
            {port.gearsBreakdown && port.gearsBreakdown.length > 0 && (
              <div className="border-t border-sky-100/60 pt-3.5 flex flex-col gap-2.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Rincian Semua Alat Penangkap Ikan</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {port.gearsBreakdown.map((gear, idx) => {
                    const pct = Math.round((gear.count / port.activeVessels) * 100);
                    return (
                      <div key={idx} className="flex flex-col gap-1 text-[11px] bg-white/65 p-2 rounded-xl border border-sky-100/30">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-700 truncate max-w-[70%]">{gear.name}</span>
                          <span className="font-mono text-slate-500 font-bold">{gear.count} unit ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className="bg-sky-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vessel Breakdown and Fleet */}
        <div className="flex flex-col gap-3">
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Ship className="w-4 h-4 text-sky-600" />
            Statistik Kapal & Perizinan Armada
          </h4>

          <div className="border border-sky-100 bg-sky-50/20 rounded-2xl p-4.5 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-sky-100/60">
              <span className="text-xs text-slate-550 font-medium">Jumlah Armada Aktif</span>
              <span className="text-lg font-bold text-slate-800">{port.activeVessels} Unit Kapal</span>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Komposisi Ukuran Kapal (GT)</p>
              {/* Progress bar visual container */}
              <div className="w-full h-4 bg-slate-100 rounded-lg overflow-hidden flex border border-sky-100/50">
                <div className="h-full bg-sky-500" style={{ width: `${smallPct}%` }} title={`Kecil (<5 GT): ${smallPct}%`} />
                <div className="h-full bg-indigo-500" style={{ width: `${medPct}%` }} title={`Sedang (5-30 GT): ${medPct}%`} />
                <div className="h-full bg-amber-500" style={{ width: `${lgPct}%` }} title={`Besar (>30 GT): ${lgPct}%`} />
              </div>

              {/* Legend metric boxes */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                {/* Small */}
                <div className="bg-white p-2 rounded-lg border border-sky-100/60 shadow-2xs flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-sky-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Kecil (&lt;5 GT)</span>
                  </div>
                  <strong className="text-slate-700 mt-1">{port.vesselBreakdown.small} <span className="text-[10px] text-slate-400 font-normal">Unit</span></strong>
                </div>

                {/* Medium */}
                <div className="bg-white p-2 rounded-lg border border-sky-100/60 shadow-2xs flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Sedang (5-30)</span>
                  </div>
                  <strong className="text-slate-700 mt-1">{port.vesselBreakdown.medium} <span className="text-[10px] text-slate-400 font-normal">Unit</span></strong>
                </div>

                {/* Large */}
                <div className="bg-white p-2 rounded-lg border border-sky-100/60 shadow-2xs flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Besar (&gt;30 GT)</span>
                  </div>
                  <strong className="text-slate-700 mt-1">{port.vesselBreakdown.large} <span className="text-[10px] text-slate-400 font-normal">Unit</span></strong>
                </div>
              </div>
            </div>

            {/* License/Permit Type Breakdown */}
            {port.permitType && (
              <div className="border-t border-sky-100/60 pt-3 flex flex-col gap-2.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Status Perizinan Kapal (Kewenangan)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-2.5 rounded-xl border border-sky-100/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase">Daerah (Prov/Kab)</span>
                      <span className="text-xs text-slate-500 leading-tight">Wewenang Daerah</span>
                    </div>
                    <span className="font-mono text-base font-bold text-sky-700">{port.permitType.daerah} <span className="text-[10px] font-normal text-slate-400">Unit</span></span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-sky-100/60 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-slate-500 font-extrabold uppercase">Pusat (KKP)</span>
                      <span className="text-xs text-slate-500 leading-tight">Wewenang Kementerian</span>
                    </div>
                    <span className="font-mono text-base font-bold text-orange-600">{port.permitType.pusat} <span className="text-[10px] font-normal text-slate-400">Unit</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Port Problems & Issues section if they exist */}
        {port.problems && port.problems.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h4 className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
              Isu & Permasalahan Lapangan Nelayan
            </h4>
            <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100/70 flex flex-col gap-2.5">
              {port.problems.map((prob, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="text-amber-600 font-bold">•</span>
                  <p>{prob}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Commodities Section */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-sky-600" />
            Komoditas Utama / Hasil Tangkapan
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {port.commodities.map((item, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-sky-100 text-xs font-semibold text-slate-700 transition-all cursor-default"
              >
                {item}
              </span>
            ))}
            {port.commodities.length === 0 && (
              <span className="text-xs text-slate-400 italic">Belum ada komoditas utama yang diinput</span>
            )}
          </div>
        </div>

        {/* Facilities Section */}
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1.5">
            <Box className="w-4 h-4 text-sky-600" />
            Sarana & Prasarana Pelabuhan
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {port.facilities.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4.5 h-4.5 text-sky-600 shrink-0" />
                <span className="font-semibold">{item}</span>
              </div>
            ))}
            {port.facilities.length === 0 && (
              <div className="col-span-2 text-xs text-slate-500 italic flex items-center gap-1">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                Belum ada sarana prasarana yang ditandai
              </div>
            )}
          </div>
        </div>

        {/* Geographic Coordinates info bar */}
        <div className="mt-2 pt-4 border-t border-sky-100 flex items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-500">Koordinat Geografis</span>
            <span className="font-mono text-slate-700 font-bold">{port.latitude.toFixed(6)}, {port.longitude.toFixed(6)}</span>
          </div>

          <button
            onClick={handleCopyCoords}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sky-100 bg-white hover:bg-sky-50 text-sky-700 hover:text-sky-850 shadow-2xs transition-all text-xs font-semibold cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-sky-600 font-semibold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Koordinat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
