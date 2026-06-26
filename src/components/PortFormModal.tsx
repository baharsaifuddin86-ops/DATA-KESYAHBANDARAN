import React, { useState, useEffect } from 'react';
import { Port, PortClass, Region, SyahbandarStaff } from '../types';
import { AVAILABLE_COMMODITIES, AVAILABLE_FACILITIES, AVAILABLE_GEARS } from '../data/defaultPorts';
import { 
  X, 
  Save, 
  MapPin, 
  Anchor, 
  Shield, 
  Ship, 
  Tag, 
  CheckSquare, 
  Calendar, 
  User, 
  Plus, 
  FileText,
  Trash2
} from 'lucide-react';

interface PortFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (port: Port) => void;
  editingPort: Port | null;
  initialCoords: { latitude: number; longitude: number; region: Region } | null;
}

export default function PortFormModal({
  isOpen,
  onClose,
  onSave,
  editingPort,
  initialCoords,
}: PortFormModalProps) {
  // Form States
  const [name, setName] = useState('');
  const [region, setRegion] = useState<Region>('Banten');
  const [district, setDistrict] = useState('');
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [portClass, setPortClass] = useState<PortClass>('PPI');
  const [dominantFishingGear, setDominantFishingGear] = useState<string>('Gillnet (Jaring Insang)');
  const [activeVessels, setActiveVessels] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [syahbandarStaff, setSyahbandarStaff] = useState<SyahbandarStaff[]>([]);
  const [problems, setProblems] = useState<string[]>([]);
  
  // Vessel breakdown states
  const [vesselSmall, setVesselSmall] = useState<number>(0);
  const [vesselMedium, setVesselMedium] = useState<number>(0);
  const [vesselLarge, setVesselLarge] = useState<number>(0);

  // Permit states
  const [permitDaerah, setPermitDaerah] = useState<number>(0);
  const [permitPusat, setPermitPusat] = useState<number>(0);

  // Lists states
  const [selectedCommodities, setSelectedCommodities] = useState<string[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [customCommodity, setCustomCommodity] = useState('');

  // Hydrate form when editingPort or initialCoords changes
  useEffect(() => {
    if (editingPort) {
      setName(editingPort.name);
      setRegion(editingPort.region);
      setDistrict(editingPort.district);
      setLatitude(editingPort.latitude);
      setLongitude(editingPort.longitude);
      setPortClass(editingPort.class);
      setDominantFishingGear(editingPort.dominantFishingGear || 'Gillnet (Jaring Insang)');
      setActiveVessels(editingPort.activeVessels);
      setDescription(editingPort.description);
      setSyahbandarStaff(editingPort.syahbandarStaff || []);
      setVesselSmall(editingPort.vesselBreakdown.small);
      setVesselMedium(editingPort.vesselBreakdown.medium);
      setVesselLarge(editingPort.vesselBreakdown.large);
      setPermitDaerah(editingPort.permitType?.daerah ?? editingPort.activeVessels);
      setPermitPusat(editingPort.permitType?.pusat ?? 0);
      setSelectedCommodities(editingPort.commodities);
      setSelectedFacilities(editingPort.facilities);
      setProblems(editingPort.problems || []);
    } else if (initialCoords) {
      setName('');
      setRegion(initialCoords.region);
      setDistrict('');
      setLatitude(initialCoords.latitude);
      setLongitude(initialCoords.longitude);
      setPortClass('PPI');
      setDominantFishingGear('Gillnet (Jaring Insang)');
      setActiveVessels(80);
      setDescription('');
      setSyahbandarStaff([]);
      setProblems([]);
      setVesselSmall(60);
      setVesselMedium(20);
      setVesselLarge(0);
      setPermitDaerah(80);
      setPermitPusat(0);
      setSelectedCommodities([]);
      setSelectedFacilities([]);
    } else {
      // Clear form
      setName('');
      setRegion('Banten');
      setDistrict('');
      setLatitude(0);
      setLongitude(0);
      setPortClass('PPI');
      setDominantFishingGear('Gillnet (Jaring Insang)');
      setActiveVessels(0);
      setDescription('');
      setSyahbandarStaff([]);
      setProblems([]);
      setVesselSmall(0);
      setVesselMedium(0);
      setVesselLarge(0);
      setPermitDaerah(0);
      setPermitPusat(0);
      setSelectedCommodities([]);
      setSelectedFacilities([]);
    }
  }, [editingPort, initialCoords, isOpen]);

  // Adjust total vessel count automatically when small, med, lg change
  useEffect(() => {
    const total = Number(vesselSmall) + Number(vesselMedium) + Number(vesselLarge);
    setActiveVessels(total);
    
    if (!editingPort) {
      setPermitDaerah(total);
      setPermitPusat(0);
    }
  }, [vesselSmall, vesselMedium, vesselLarge, editingPort]);

  if (!isOpen) return null;

  // Toggle Commodities selection
  const handleToggleCommodity = (comm: string) => {
    setSelectedCommodities(prev => 
      prev.includes(comm) ? prev.filter(c => c !== comm) : [...prev, comm]
    );
  };

  // Add custom commodity
  const handleAddCustomCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCommodity.trim() && !selectedCommodities.includes(customCommodity.trim())) {
      setSelectedCommodities(prev => [...prev, customCommodity.trim()]);
      setCustomCommodity('');
    }
  };

  // Toggle Facilities selection
  const handleToggleFacility = (fac: string) => {
    setSelectedFacilities(prev => 
      prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
    );
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert("Nama pelabuhan wajib diisi!");
      return;
    }
    if (!district.trim()) {
      alert("Kecamatan/Kabupaten wajib diisi!");
      return;
    }
    if (latitude === 0 || longitude === 0) {
      alert("Koordinat tidak boleh bernilai nol. Klik peta atau input koordinat dengan benar.");
      return;
    }

    const payload: Port = {
      id: editingPort ? editingPort.id : `port-custom-${Date.now()}`,
      name: name.trim(),
      region,
      district: district.trim(),
      latitude,
      longitude,
      class: portClass,
      dominantFishingGear,
      activeVessels,
      commodities: selectedCommodities,
      facilities: selectedFacilities,
      description: description.trim() || `Pelabuhan perikanan di wilayah ${district}, ${region}.`,
      syahbandarStaff,
      vesselBreakdown: {
        small: Number(vesselSmall),
        medium: Number(vesselMedium),
        large: Number(vesselLarge),
      },
      permitType: {
        daerah: Number(permitDaerah),
        pusat: Number(permitPusat)
      },
      problems: problems.filter(p => p.trim() !== '')
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-sky-100 overflow-hidden animate-slideUp">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-sky-100 bg-sky-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-sky-600" />
            <h3 className="font-display font-bold text-base text-sky-950">
              {editingPort ? 'Edit Data Pelabuhan' : 'Tentukan Titik & Tambah Pelabuhan Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-sky-100/50 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-xs text-slate-600">
          
          {/* Section 1: Identitas Dasar */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 border-b border-sky-100 pb-1 text-sky-900 font-bold">
              <Shield className="w-4 h-4 text-sky-600" />
              <span>INFORMASI DASAR PELABUHAN</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Nama Lengkap Pelabuhan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PPI Labuhan Maringgai"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs"
                />
              </div>

              {/* Class */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Kelas Klasifikasi Pelabuhan *</label>
                <select
                  value={portClass}
                  onChange={(e) => setPortClass(e.target.value as PortClass)}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs cursor-pointer"
                >
                  <option value="PPS">PPS - Samudera (Tipe A)</option>
                  <option value="PPN">PPN - Nusantara (Tipe B)</option>
                  <option value="PPP">PPP - Pantai (Tipe C)</option>
                  <option value="PPI">PPI - Pendaratan Ikan (Tipe D)</option>
                </select>
              </div>

              {/* Region */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Provinsi / Wilayah *</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs cursor-pointer"
                >
                  <option value="Banten">Banten</option>
                  <option value="Lampung">Lampung</option>
                </select>
              </div>

              {/* District */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Kecamatan / Kabupaten *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pandeglang atau Labuhan Maringgai"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Lokasi Koordinat */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 border-b border-sky-100 pb-1 text-sky-900 font-bold">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>KOORDINAT GEOGRAFIS (BISA DIINPUT / DIKLIK DARI PETA)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Latitude */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Latitude (Garis Lintang) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="-6.12345"
                  value={latitude || ''}
                  onChange={(e) => setLatitude(Number(e.target.value))}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs"
                />
              </div>

              {/* Longitude */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Longitude (Garis Bujur) *</label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="105.12345"
                  value={longitude || ''}
                  onChange={(e) => setLongitude(Number(e.target.value))}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>
            {initialCoords && (
              <p className="text-[10px] text-sky-700 font-semibold bg-sky-50 px-3 py-2 rounded-lg border border-sky-100 animate-pulse">
                ✓ Koordinat berhasil terisi otomatis dari klik titik peta Anda!
              </p>
            )}
          </div>

          {/* Section 3: Alat Tangkap & Armada Kapal */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 border-b border-sky-100 pb-1 text-sky-900 font-bold">
              <Ship className="w-4 h-4 text-sky-600" />
              <span>ALAT TANGKAP & FLEET KAPAL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dominant Fishing Gear */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Alat Penangkap Ikan Dominan *</label>
                <select
                  value={dominantFishingGear}
                  onChange={(e) => setDominantFishingGear(e.target.value)}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs cursor-pointer"
                >
                  {AVAILABLE_GEARS.map((gear) => (
                    <option key={gear} value={gear}>
                      {gear}
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Vessel Count (Editable) */}
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-slate-500">Total Kapal Aktif (Unit) *</label>
                <input
                  type="number"
                  min="0"
                  value={activeVessels || ''}
                  onChange={(e) => setActiveVessels(Number(e.target.value))}
                  className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs"
                />
              </div>
            </div>

            {/* Vessel Breakdown Grid */}
            <div className="bg-sky-50/40 p-3.5 rounded-xl border border-sky-100 grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kapal Kecil (&lt;5 GT)</label>
                <input
                  type="number"
                  min="0"
                  value={vesselSmall || ''}
                  onChange={(e) => setVesselSmall(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-sky-200/60 rounded-md focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-700 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kapal Sedang (5-30 GT)</label>
                <input
                  type="number"
                  min="0"
                  value={vesselMedium || ''}
                  onChange={(e) => setVesselMedium(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-sky-200/60 rounded-md focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-700 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Kapal Besar (&gt;30 GT)</label>
                <input
                  type="number"
                  min="0"
                  value={vesselLarge || ''}
                  onChange={(e) => setVesselLarge(Number(e.target.value))}
                  className="px-2.5 py-1.5 bg-white border border-sky-200/60 rounded-md focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-700 text-xs"
                />
              </div>
            </div>

            {/* Permit Type Breakdown */}
            <div className="bg-sky-50/30 p-3.5 rounded-xl border border-sky-100/60 flex flex-col gap-2 mt-2">
              <span className="font-semibold text-slate-700 text-[10px] uppercase tracking-wider">Jenis Izin Kapal</span>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Izin Daerah (Unit)</label>
                  <input
                    type="number"
                    min="0"
                    value={permitDaerah || ''}
                    onChange={(e) => setPermitDaerah(Number(e.target.value))}
                    className="px-2.5 py-1.5 bg-white border border-sky-200/60 rounded-md focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-700 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Izin Pusat (Unit)</label>
                  <input
                    type="number"
                    min="0"
                    value={permitPusat || ''}
                    onChange={(e) => setPermitPusat(Number(e.target.value))}
                    className="px-2.5 py-1.5 bg-white border border-sky-200/60 rounded-md focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-700 text-xs"
                  />
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-medium">
                Keterangan: Izin daerah + pusat idealnya berjumlah sama dengan total kapal aktif ({activeVessels} unit).
              </p>
            </div>
          </div>

          {/* Section 4: Komoditas */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 border-b border-sky-100 pb-1 text-sky-900 font-bold">
              <Tag className="w-4 h-4 text-sky-600" />
              <span>KOMODITAS UTAMA (HASIL TANGKAPAN)</span>
            </div>

            {/* Quick add custom commodity */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tambahkan komoditas kustom..."
                value={customCommodity}
                onChange={(e) => setCustomCommodity(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-sky-200/60 text-slate-700 focus:outline-hidden placeholder:text-slate-400 focus:bg-white rounded-lg text-xs"
              />
              <button
                type="button"
                onClick={handleAddCustomCommodity}
                className="px-3.5 py-2 bg-sky-50 border border-sky-100 text-sky-700 rounded-lg hover:bg-sky-100 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>

            {/* Commodities Select Grid */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-slate-500">Pilih Komoditas Hasil Tangkapan:</label>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 bg-sky-50/30 rounded-xl border border-sky-100">
                {AVAILABLE_COMMODITIES.map((comm) => {
                  const isSelected = selectedCommodities.includes(comm);
                  return (
                    <button
                      type="button"
                      key={comm}
                      onClick={() => handleToggleCommodity(comm)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-sky-100 text-sky-700 border-sky-300'
                          : 'bg-white text-slate-600 border-sky-100 hover:border-sky-200'
                      }`}
                    >
                      {comm}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 5: Sarana Prasarana */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 border-b border-sky-100 pb-1 text-sky-900 font-bold">
              <CheckSquare className="w-4 h-4 text-sky-600" />
              <span>SARANA & PRASARANA PENDUKUNG</span>
            </div>

            <div className="grid grid-cols-2 gap-2 p-2 bg-sky-50/30 rounded-xl border border-sky-100 max-h-36 overflow-y-auto">
              {AVAILABLE_FACILITIES.map((fac) => {
                const isChecked = selectedFacilities.includes(fac);
                return (
                  <label
                    key={fac}
                    className="flex items-center gap-2 px-1.5 py-1 hover:bg-sky-50/50 rounded-md cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleFacility(fac)}
                      className="rounded text-sky-600 focus:ring-sky-500/40 border-sky-200 bg-white cursor-pointer w-3.5 h-3.5"
                    />
                    <span className="text-[10px] font-medium text-slate-600">{fac}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 6: Informasi Kontak & Pendukung */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-1.5 border-b border-sky-100 pb-1 text-sky-900 font-bold">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>MANAJEMEN PETUGAS KANTOR SYAHBANDAR</span>
            </div>

            {/* Syahbandar & Staff Management */}
            <div className="flex flex-col gap-2 bg-sky-50/20 p-4 rounded-xl border border-sky-100/60">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-700 text-xs">Daftar Syahbandar & Petugas Syahbandar</span>
                <button
                  type="button"
                  onClick={() => setSyahbandarStaff([...syahbandarStaff, { position: '', name: '', stay: '' }])}
                  className="px-2.5 py-1 text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Petugas
                </button>
              </div>

              {syahbandarStaff.length > 0 ? (
                <div className="flex flex-col gap-2.5 mt-2">
                  {syahbandarStaff.map((staff, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-white border border-sky-100 rounded-lg shadow-xs relative">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Jabatan / Posisi</label>
                        <input
                          type="text"
                          placeholder="Contoh: Syahbandar / Verifikator"
                          required
                          value={staff.position}
                          onChange={(e) => {
                            const newStaff = [...syahbandarStaff];
                            newStaff[idx] = { ...newStaff[idx], position: e.target.value };
                            setSyahbandarStaff(newStaff);
                          }}
                          className="px-2 py-1.5 bg-slate-50 border border-sky-100 rounded text-xs focus:outline-hidden"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Nama Lengkap</label>
                        <input
                          type="text"
                          placeholder="Contoh: GELLEN NENDO PERDANA A.Md, S.E."
                          required
                          value={staff.name}
                          onChange={(e) => {
                            const newStaff = [...syahbandarStaff];
                            newStaff[idx] = { ...newStaff[idx], name: e.target.value };
                            setSyahbandarStaff(newStaff);
                          }}
                          className="px-2 py-1.5 bg-slate-50 border border-sky-100 rounded text-xs focus:outline-hidden"
                        />
                      </div>
                      <div className="flex flex-col gap-1 relative pr-8">
                        <label className="text-[9px] font-bold text-slate-400 uppercase">Tempat Tinggal / Stay</label>
                        <input
                          type="text"
                          placeholder="Contoh: Kuala Penet / Karangantu"
                          value={staff.stay || ''}
                          onChange={(e) => {
                            const newStaff = [...syahbandarStaff];
                            newStaff[idx] = { ...newStaff[idx], stay: e.target.value };
                            setSyahbandarStaff(newStaff);
                          }}
                          className="px-2 py-1.5 bg-slate-50 border border-sky-100 rounded text-xs focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => setSyahbandarStaff(syahbandarStaff.filter((_, sIdx) => sIdx !== idx))}
                          className="absolute right-0 bottom-1.5 p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 italic text-center py-2">Belum ada rincian petugas kantor syahbandar yang ditambahkan untuk pelabuhan ini.</p>
              )}
            </div>
            
            {/* Section 7: Daftar Permasalahan / Isu Pelabuhan */}
            <div className="flex flex-col gap-2 bg-rose-50/20 p-4 rounded-xl border border-rose-100/60 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-rose-950 text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-rose-600" />
                  Daftar Permasalahan / Isu di Pelabuhan
                </span>
                <button
                  type="button"
                  onClick={() => setProblems([...problems, ''])}
                  className="px-2.5 py-1 text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Isu/Masalah
                </button>
              </div>

              {problems.length > 0 ? (
                <div className="flex flex-col gap-2 mt-2">
                  {problems.map((prob, idx) => (
                    <div key={idx} className="flex items-center gap-2 relative">
                      <input
                        type="text"
                        placeholder="Contoh: Pendangkalan alur pelayaran akibat sedimentasi tinggi"
                        required
                        value={prob}
                        onChange={(e) => {
                          const newProbs = [...problems];
                          newProbs[idx] = e.target.value;
                          setProblems(newProbs);
                        }}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden pr-8 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setProblems(problems.filter((_, pIdx) => pIdx !== idx))}
                        className="absolute right-2 top-2 p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 italic text-center py-2">Belum ada permasalahan khusus yang ditambahkan.</p>
              )}
            </div>

            {/* Description / Keterangan */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="font-semibold text-slate-500">Keterangan / Deskripsi Pelabuhan *</label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan keterangan lengkap, sejarah singkat, kendala utama, atau potensi khusus pelabuhan perikanan ini..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-sky-200/60 rounded-lg text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all text-xs resize-none"
              />
            </div>
          </div>

        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-sky-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 border border-sky-100 text-slate-500 hover:bg-sky-50/50 hover:text-slate-700 rounded-xl font-semibold text-xs cursor-pointer bg-white shadow-2xs transition-colors"
          >
            Batal
          </button>
          
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-semibold text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sky-500/20 shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pelabuhan</span>
          </button>
        </div>
      </div>
    </div>
  );
}
