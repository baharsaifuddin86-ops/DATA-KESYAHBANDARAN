import React, { useState } from 'react';
import { Port, PortClass, Region } from '../types';
import { 
  Search, 
  MapPin, 
  Plus, 
  Download, 
  Upload, 
  X, 
  Anchor, 
  SlidersHorizontal,
  Lock,
  Edit2,
  FileDown,
  FileUp,
  Filter
} from 'lucide-react';

interface PortListPanelProps {
  ports: Port[];
  selectedPortId: string | null;
  onSelectPort: (id: string) => void;
  onAddNewClick: () => void;
  onEditClick: (port: Port) => void;
  onDeleteClick: (id: string) => void;
  onImportPorts: (imported: Port[]) => void;
  isAddingNew: boolean;
}

export default function PortListPanel({
  ports,
  selectedPortId,
  onSelectPort,
  onAddNewClick,
  onEditClick,
  onDeleteClick,
  onImportPorts,
  isAddingNew,
}: PortListPanelProps) {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState<PortClass | 'All'>('All');
  const [regionFilter, setRegionFilter] = useState<Region | 'All'>('All');
  const [showFilters, setShowFilters] = useState(false);

  // Filter Logic
  const filteredPorts = ports.filter((port) => {
    const matchesSearch = port.name.toLowerCase().includes(search.toLowerCase()) || 
                          port.district.toLowerCase().includes(search.toLowerCase()) ||
                          port.commodities.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchesClass = classFilter === 'All' || port.class === classFilter;
    const matchesRegion = regionFilter === 'All' || port.region === regionFilter;
    return matchesSearch && matchesClass && matchesRegion;
  });

  // Export Ports to JSON
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ports, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "sebaran_pelabuhan_perikanan.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Ports from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            // Basic validation
            const isValid = parsed.every(p => p.id && p.name && p.region && p.latitude && p.longitude);
            if (isValid) {
              onImportPorts(parsed);
              alert("Data pelabuhan berhasil diimpor!");
            } else {
              alert("Format file salah: Beberapa objek tidak memiliki data wajib.");
            }
          } else {
            alert("Format file salah: Data harus berupa array.");
          }
        } catch (err) {
          alert("Gagal membaca file JSON.");
        }
      };
    }
  };

  // Helper to get class colors suited for bright sea-blue theme
  const getClassBadge = (cls: PortClass) => {
    switch (cls) {
      case 'PPS': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'PPN': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'PPP': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PPI': return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="flex flex-col w-full bg-white border border-sky-100 rounded-2xl shadow-md p-4 gap-3">
      {/* Top Controller Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center justify-between md:justify-start gap-4">
          <div>
            <h3 className="font-display font-bold text-sm text-sky-950 tracking-tight flex items-center gap-1.5">
              <Anchor className="w-4.5 h-4.5 text-sky-600" />
              Daftar Pelabuhan Binaan
            </h3>
            <span className="text-[10px] text-slate-500 font-medium">
              Ditemukan: <strong className="text-sky-600 font-bold">{filteredPorts.length}</strong> pelabuhan
            </span>
          </div>

          {/* Quick Actions (Add, Export, Import) */}
          <div className="flex items-center gap-1.5">
            {/* Add New Button */}
            <button
              onClick={onAddNewClick}
              className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs ${
                isAddingNew
                  ? 'bg-rose-500 text-white hover:bg-rose-600'
                  : 'bg-sky-600 text-white hover:bg-sky-700'
              }`}
              title={isAddingNew ? "Batal memilih titik baru pada peta" : "Pilih lokasi pada peta untuk menambah pelabuhan baru"}
            >
              {isAddingNew ? (
                <>
                  <X className="w-3.5 h-3.5" />
                  <span>Batal Pilih Titik</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Titik</span>
                </>
              )}
            </button>

            {/* Export */}
            <button
              onClick={handleExport}
              title="Ekspor Data JSON"
              className="p-1.5 hover:bg-sky-50 text-sky-700 hover:text-sky-800 rounded-lg transition-colors cursor-pointer border border-sky-100 bg-white"
            >
              <FileDown className="w-3.5 h-3.5" />
            </button>
            
            {/* Import */}
            <label
              title="Impor Data JSON"
              className="p-1.5 hover:bg-sky-50 text-sky-700 hover:text-sky-800 rounded-lg transition-colors cursor-pointer border border-sky-100 bg-white flex items-center justify-center"
            >
              <FileUp className="w-3.5 h-3.5" />
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex flex-1 md:max-w-md items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama, wilayah, komoditas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-[11px] pl-8 pr-7 py-2 bg-slate-50 border border-sky-100 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-450 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-2 rounded-lg transition-all border cursor-pointer ${
              showFilters || classFilter !== 'All' || regionFilter !== 'All'
                ? 'bg-sky-50 text-sky-700 border-sky-200 shadow-2xs'
                : 'text-slate-500 hover:text-sky-700 bg-slate-50 border-transparent'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Saringan</span>
            {(classFilter !== 'All' || regionFilter !== 'All') && (
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            )}
          </button>

          {(classFilter !== 'All' || regionFilter !== 'All' || search) && (
            <button
              onClick={() => {
                setClassFilter('All');
                setRegionFilter('All');
                setSearch('');
              }}
              className="text-[10px] text-rose-500 hover:text-rose-600 font-bold shrink-0 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Expandable Filter Grid - Horizontal & Compact */}
      {showFilters && (
        <div className="p-3 bg-slate-50/50 rounded-xl border border-sky-100/80 flex flex-col sm:flex-row sm:items-center gap-4 animate-fadeIn shadow-2xs">
          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Wilayah:</span>
            <div className="flex gap-1">
              {['All', 'Banten', 'Lampung'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setRegionFilter(reg as any)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
                    regionFilter === reg
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100/80'
                  }`}
                >
                  {reg === 'All' ? 'Semua' : reg}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical divider on big screens */}
          <div className="hidden sm:block h-4 w-px bg-slate-200" />

          {/* Class Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Kelas:</span>
            <div className="flex gap-1 flex-wrap">
              {['All', 'PPS', 'PPN', 'PPP', 'PPI'].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setClassFilter(cls as any)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
                    classFilter === cls
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100/80'
                  }`}
                >
                  {cls === 'All' ? 'Semua' : (cls === 'PPI' ? 'PP' : cls)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ports List Scrollable Area - Now Horizontal and Responsive */}
      <div className="w-full bg-sky-50/20 border border-sky-100/50 rounded-xl p-2">
        {filteredPorts.length > 0 ? (
          <div className="flex overflow-x-auto gap-3 pb-1.5 pt-0.5 scrollbar-thin scrollbar-thumb-sky-200/80 scrollbar-track-transparent">
            {filteredPorts.map((port) => {
              const isSelected = port.id === selectedPortId;
              return (
                <div
                  key={port.id}
                  onClick={() => onSelectPort(port.id)}
                  className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-2 min-w-[240px] md:min-w-[280px] max-w-[300px] shrink-0 ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-500 shadow-sm ring-1 ring-sky-500/15'
                      : 'bg-white border-sky-100 hover:border-sky-300 hover:bg-sky-50/20'
                  }`}
                >
                  {/* Top Row: Class Badge & Actions */}
                  <div className="flex items-center justify-between gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wide border uppercase shrink-0 ${getClassBadge(port.class)}`}>
                      {port.class === 'PPI' ? 'PP' : port.class}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditClick(port);
                        }}
                        className="p-1 text-slate-400 hover:text-sky-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="Edit Data"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <div
                        className="p-1 text-slate-400 bg-slate-50 border border-slate-100 rounded flex items-center justify-center cursor-not-allowed"
                        title="Sistem Terkunci: Pelabuhan tidak dapat dihapus untuk menjaga keutuhan data wilayah"
                      >
                        <Lock className="w-2.5 h-2.5 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  {/* Port Name - Highly prominent and clarified */}
                  <div className="min-w-0 my-0.5">
                    <h4 className="font-display font-black text-xs md:text-[13px] text-slate-900 group-hover:text-sky-600 transition-colors leading-snug truncate" title={port.name}>
                      {port.name}
                    </h4>
                  </div>

                  {/* Subtitle: District & Active Vessels */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium border-t border-slate-100 pt-1.5 mt-0.5">
                    <div className="flex items-center gap-1 min-w-0">
                      <MapPin className="w-3 h-3 shrink-0 text-sky-500" />
                      <span className="truncate text-[10px] text-slate-600">{port.district}</span>
                    </div>
                    <span className="shrink-0 text-sky-700 bg-sky-50 border border-sky-100/60 px-1.5 py-0.5 rounded font-bold text-[9px]">
                      {port.activeVessels.toLocaleString('id-ID')} Kapal
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
            <Anchor className="w-5 h-5 text-slate-400 stroke-[1.5]" />
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-500">Pelabuhan Tidak Ditemukan</p>
              <p className="text-[9px] text-slate-400">Cobalah kata kunci lain atau ubah filter saringan.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
