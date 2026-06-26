import { useState, useEffect } from 'react';
import { X, Trash2, Plus, Save, Users } from 'lucide-react';
import { 
  InfographicState, BinaanPort, SKKPApplication, MigrantVessel, 
  PNBPPercentile, SyahbandarOfficer, BinaanVesselCount, GeneralProblem, 
  PNBPDecreaseFactor, SHTIApplication, SkkpRecapYear, SkkpRecapLocation,
  SkkpOfficer, PnbpSdaAchievement
} from './StatsDashboard';

interface InfographicModalProps {
  editingSection: string | null;
  infoData: InfographicState;
  onClose: () => void;
  onSave: (section: string, data: any) => void;
}

export default function InfographicModal({ editingSection, infoData, onClose, onSave }: InfographicModalProps) {
  // Temp states to hold inputs
  const [tempBanner, setTempBanner] = useState({ title: '', subtitle: '', periodLabel: '' });
  const [tempBinaanPorts, setTempBinaanPorts] = useState<BinaanPort[]>([]);

  const [tempSyahbandar, setTempSyahbandar] = useState<SyahbandarOfficer[]>([]);
  const [tempVesselCounts, setTempVesselCounts] = useState<BinaanVesselCount[]>([]);
  const [tempProblems, setTempProblems] = useState<GeneralProblem[]>([]);
  const [tempFactors, setTempFactors] = useState<PNBPDecreaseFactor[]>([]);
  const [tempSHTI, setTempSHTI] = useState<SHTIApplication[]>([]);
  const [tempGoals, setTempGoals] = useState('');
  const [tempSkkpRecap, setTempSkkpRecap] = useState<SkkpRecapYear[]>([]);
  const [tempSkkpOfficers, setTempSkkpOfficers] = useState<SkkpOfficer[]>([]);
  const [tempPnbpSda, setTempPnbpSda] = useState<PnbpSdaAchievement[]>([]);
  const [activeRecapYear, setActiveRecapYear] = useState<string>('2025');

  // Synchronize state when open
  useEffect(() => {
    if (!editingSection) return;
    if (editingSection === 'banner') {
      setTempBanner({
        title: infoData.title,
        subtitle: infoData.subtitle,
        periodLabel: infoData.periodLabel
      });
    } else if (editingSection === 'binaan') {
      setTempBinaanPorts([...infoData.binaanPorts]);

    } else if (editingSection === 'syahbandar') {
      setTempSyahbandar([...infoData.syahbandarDistribution]);
    } else if (editingSection === 'vessel_counts') {
      setTempVesselCounts([...infoData.binaanVesselCounts]);
    } else if (editingSection === 'problems') {
      setTempProblems([...infoData.generalProblems]);
    } else if (editingSection === 'factors') {
      setTempFactors([...infoData.pnbpDecreaseFactors]);
    } else if (editingSection === 'shti') {
      setTempSHTI([...infoData.shtiApplications]);
    } else if (editingSection === 'goals') {
      setTempGoals(infoData.goals);
    } else if (editingSection === 'skkp_recap') {
      setTempSkkpRecap(JSON.parse(JSON.stringify(infoData.skkpRecap || [])));
      setTempSkkpOfficers(JSON.parse(JSON.stringify(infoData.skkpOfficers || [])));
      setActiveRecapYear('2025');
    } else if (editingSection === 'pnbp_sda') {
      setTempPnbpSda(JSON.parse(JSON.stringify(infoData.pnbpSdaAchievements || [])));
    }
  }, [editingSection, infoData]);

  if (!editingSection) return null;

  const handleSave = () => {
    if (editingSection === 'banner') {
      onSave(editingSection, tempBanner);
    } else if (editingSection === 'binaan') {
      onSave(editingSection, tempBinaanPorts);

    } else if (editingSection === 'syahbandar') {
      onSave(editingSection, tempSyahbandar);
    } else if (editingSection === 'vessel_counts') {
      onSave(editingSection, tempVesselCounts);
    } else if (editingSection === 'problems') {
      onSave(editingSection, tempProblems);
    } else if (editingSection === 'factors') {
      onSave(editingSection, tempFactors);
    } else if (editingSection === 'shti') {
      onSave(editingSection, tempSHTI);
    } else if (editingSection === 'goals') {
      onSave(editingSection, tempGoals);
    } else if (editingSection === 'skkp_recap') {
      onSave(editingSection, { skkpRecap: tempSkkpRecap, skkpOfficers: tempSkkpOfficers });
    } else if (editingSection === 'pnbp_sda') {
      onSave(editingSection, tempPnbpSda);
    }
  };

  const getTitle = () => {
    switch (editingSection) {
      case 'banner': return 'Banner Utama & Judul';
      case 'binaan': return 'Daftar Pelabuhan Binaan';

      case 'syahbandar': return 'Penyebaran Syahbandar';
      case 'vessel_counts': return 'Jumlah Kapal Binaan';
      case 'problems': return 'Isu / Permasalahan Lapangan';
      case 'factors': return 'Faktor Penurunan PNBP';
      case 'shti': return 'Data Permohonan SHTI';
      case 'goals': return 'Tujuan Utama Infografis';
      case 'skkp_recap': return 'Rekap Penerbitan SKKP';
      case 'pnbp_sda': return 'Capaian PNBP SDA';
      default: return 'Ubah Data';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn text-slate-700">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-100 flex flex-col overflow-hidden max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h3 className="font-display font-black text-sm uppercase text-slate-800 tracking-wider">
              Ubah {getTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh] custom-scrollbar">
          
          {editingSection === 'banner' && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1">Judul Utama Infografis</label>
                <input
                  type="text"
                  value={tempBanner.title}
                  onChange={(e) => setTempBanner({ ...tempBanner, title: e.target.value })}
                  className="w-full text-xs font-semibold border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1">Sub-Judul / Instansi</label>
                <input
                  type="text"
                  value={tempBanner.subtitle}
                  onChange={(e) => setTempBanner({ ...tempBanner, subtitle: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-sky-500"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1">Label Periode</label>
                <input
                  type="text"
                  value={tempBanner.periodLabel}
                  onChange={(e) => setTempBanner({ ...tempBanner, periodLabel: e.target.value })}
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 focus:outline-hidden focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {editingSection === 'binaan' && (
            <div className="space-y-3">
              {tempBinaanPorts.map((port, idx) => (
                <div key={port.id || idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder="Nama Pelabuhan"
                      value={port.name}
                      onChange={(e) => {
                        const updated = [...tempBinaanPorts];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setTempBinaanPorts(updated);
                      }}
                      className="w-full text-xs font-bold border border-slate-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Lokasi Wilayah"
                      value={port.loc}
                      onChange={(e) => {
                        const updated = [...tempBinaanPorts];
                        updated[idx] = { ...updated[idx], loc: e.target.value };
                        setTempBinaanPorts(updated);
                      }}
                      className="w-full text-[11px] border border-slate-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setTempBinaanPorts(tempBinaanPorts.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTempBinaanPorts([...tempBinaanPorts, { id: Date.now(), name: '', loc: '' }])}
                className="w-full py-2 border border-dashed border-sky-300 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pelabuhan Binaan</span>
              </button>
            </div>
          )}



          {editingSection === 'syahbandar' && (
            <div className="space-y-4">
              {tempSyahbandar.map((officer, idx) => (
                <div key={officer.id || idx} className="flex flex-col gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-sky-700 uppercase flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Pejabat Syahbandar ({officer.name || "Baru"})
                    </span>
                    <button
                      type="button"
                      onClick={() => setTempSyahbandar(tempSyahbandar.filter((_, i) => i !== idx))}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Nama Lengkap Pejabat</label>
                    <input
                      type="text"
                      value={officer.name}
                      onChange={(e) => {
                        const updated = [...tempSyahbandar];
                        updated[idx] = { ...updated[idx], name: e.target.value };
                        setTempSyahbandar(updated);
                      }}
                      className="w-full text-xs font-bold border border-slate-300 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-1">Wilayah Kerja / Pelabuhan (pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={officer.ports.join(', ')}
                      onChange={(e) => {
                        const updated = [...tempSyahbandar];
                        updated[idx] = { 
                          ...updated[idx], 
                          ports: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
                        };
                        setTempSyahbandar(updated);
                      }}
                      className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTempSyahbandar([...tempSyahbandar, { id: String(Date.now()), no: tempSyahbandar.length + 1, name: '', ports: [] }])}
                className="w-full py-2 border border-dashed border-sky-300 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Penugasan Syahbandar</span>
              </button>
            </div>
          )}

          {editingSection === 'vessel_counts' && (
            <div className="space-y-3">
              {tempVesselCounts.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Nama Pelabuhan"
                    value={item.name}
                    onChange={(e) => {
                      const updated = [...tempVesselCounts];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setTempVesselCounts(updated);
                    }}
                    className="w-2/3 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                  />
                  <input
                    type="number"
                    placeholder="Jumlah Kapal"
                    value={item.count}
                    onChange={(e) => {
                      const updated = [...tempVesselCounts];
                      updated[idx] = { ...updated[idx], count: Number(e.target.value) };
                      setTempVesselCounts(updated);
                    }}
                    className="w-1/3 text-xs border border-slate-300 rounded px-2.5 py-1.5 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setTempVesselCounts(tempVesselCounts.filter((_, i) => i !== idx))}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTempVesselCounts([...tempVesselCounts, { id: String(Date.now()), name: '', count: 0 }])}
                className="w-full py-2 border border-dashed border-sky-300 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Lokasi Kapal</span>
              </button>
            </div>
          )}

          {editingSection === 'problems' && (
            <div className="space-y-4">
              {tempProblems.map((prob, idx) => (
                <div key={prob.id || idx} className="flex flex-col gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-700">Kendala Lapangan #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setTempProblems(tempProblems.filter((_, i) => i !== idx))}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Topik Masalah</label>
                    <input
                      type="text"
                      value={prob.title}
                      onChange={(e) => {
                        const updated = [...tempProblems];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setTempProblems(updated);
                      }}
                      className="w-full text-xs font-bold border border-slate-300 rounded p-1.5 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Penjelasan Kendala (Paragraf 1)</label>
                    <textarea
                      value={prob.text1}
                      onChange={(e) => {
                        const updated = [...tempProblems];
                        updated[idx] = { ...updated[idx], text1: e.target.value };
                        setTempProblems(updated);
                      }}
                      rows={2}
                      className="w-full text-[11px] border border-slate-300 rounded p-1.5 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Penjelasan Tambahan (Paragraf 2)</label>
                    <textarea
                      value={prob.text2}
                      onChange={(e) => {
                        const updated = [...tempProblems];
                        updated[idx] = { ...updated[idx], text2: e.target.value };
                        setTempProblems(updated);
                      }}
                      rows={2}
                      className="w-full text-[11px] border border-slate-300 rounded p-1.5 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Rencana Tindak Lanjut / Solusi</label>
                    <input
                      type="text"
                      value={prob.plan}
                      onChange={(e) => {
                        const updated = [...tempProblems];
                        updated[idx] = { ...updated[idx], plan: e.target.value };
                        setTempProblems(updated);
                      }}
                      className="w-full text-[11px] border border-slate-300 rounded p-1.5 focus:outline-hidden"
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTempProblems([...tempProblems, { id: String(Date.now()), title: '', text1: '', text2: '', plan: '' }])}
                className="w-full py-2.5 border border-dashed border-sky-300 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Permasalahan Lapangan</span>
              </button>
            </div>
          )}

          {editingSection === 'factors' && (
            <div className="space-y-3">
              {tempFactors.map((factor, idx) => (
                <div key={factor.id || idx} className="flex gap-2 items-start bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 mt-2 w-5 shrink-0">{idx + 1}.</span>
                  <textarea
                    placeholder="Faktor penyebab..."
                    value={factor.text}
                    onChange={(e) => {
                      const updated = [...tempFactors];
                      updated[idx] = { ...updated[idx], text: e.target.value };
                      setTempFactors(updated);
                    }}
                    rows={2}
                    className="flex-1 text-[11px] border border-slate-300 rounded p-1.5 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setTempFactors(tempFactors.filter((_, i) => i !== idx))}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTempFactors([...tempFactors, { id: String(Date.now()), no: tempFactors.length + 1, text: '' }])}
                className="w-full py-2 border border-dashed border-sky-300 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Faktor Baru</span>
              </button>
            </div>
          )}

          {editingSection === 'pnbp_sda' && (
            <div className="space-y-4">
              <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                Ubah data capaian PNBP SDA untuk masing-masing Pelabuhan PIT. Isi nilai dengan angka (tanpa titik/koma) atau 0 untuk menampilkan tanda strip (-).
              </p>
              {tempPnbpSda.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-amber-700 uppercase">Pelabuhan PIT #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setTempPnbpSda(tempPnbpSda.filter((_, i) => i !== idx))}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer animate-fadeIn"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Nama Pelabuhan</label>
                    <input
                      type="text"
                      value={item.portName}
                      onChange={(e) => {
                        const updated = [...tempPnbpSda];
                        updated[idx] = { ...updated[idx], portName: e.target.value };
                        setTempPnbpSda(updated);
                      }}
                      className="w-full text-xs font-bold border border-slate-300 rounded p-1.5 focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Capaian Tahun 2025 (Rp)</label>
                      <input
                        type="number"
                        value={item.amount2025}
                        onChange={(e) => {
                          const updated = [...tempPnbpSda];
                          updated[idx] = { ...updated[idx], amount2025: Number(e.target.value) };
                          setTempPnbpSda(updated);
                        }}
                        className="w-full text-xs font-mono border border-slate-300 rounded p-1.5 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 block mb-0.5">Capaian Tahun 2026 (Rp)</label>
                      <input
                        type="number"
                        value={item.amount2026}
                        onChange={(e) => {
                          const updated = [...tempPnbpSda];
                          updated[idx] = { ...updated[idx], amount2026: Number(e.target.value) };
                          setTempPnbpSda(updated);
                        }}
                        className="w-full text-xs font-mono border border-slate-300 rounded p-1.5 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTempPnbpSda([...tempPnbpSda, { id: String(Date.now()), portName: '', amount2025: 0, amount2026: 0 }])}
                className="w-full py-2.5 border border-dashed border-sky-300 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris Pelabuhan PIT</span>
              </button>
            </div>
          )}

          {editingSection === 'shti' && (
            <div className="space-y-3">
              {tempSHTI.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-orange-700 tracking-wider">Baris Tabel SHTI #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => setTempSHTI(tempSHTI.filter((_, i) => i !== idx))}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 block mb-0.5 text-center">Periode</label>
                      <input
                        type="text"
                        value={item.year}
                        onChange={(e) => {
                          const updated = [...tempSHTI];
                          updated[idx] = { ...updated[idx], year: e.target.value };
                          setTempSHTI(updated);
                        }}
                        className="w-full text-xs border border-slate-300 rounded p-1 text-center font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 block mb-0.5 text-center">LA</label>
                      <input
                        type="number"
                        value={item.la}
                        onChange={(e) => {
                          const updated = [...tempSHTI];
                          updated[idx] = { ...updated[idx], la: Number(e.target.value) };
                          setTempSHTI(updated);
                        }}
                        className="w-full text-xs border border-slate-300 rounded p-1 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 block mb-0.5 text-center">LT</label>
                      <input
                        type="number"
                        value={item.lt}
                        onChange={(e) => {
                          const updated = [...tempSHTI];
                          updated[idx] = { ...updated[idx], lt: Number(e.target.value) };
                          setTempSHTI(updated);
                        }}
                        className="w-full text-xs border border-slate-300 rounded p-1 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 block mb-0.5 text-center">LTS</label>
                      <input
                        type="number"
                        value={item.lts}
                        onChange={(e) => {
                          const updated = [...tempSHTI];
                          updated[idx] = { ...updated[idx], lts: Number(e.target.value) };
                          setTempSHTI(updated);
                        }}
                        className="w-full text-xs border border-slate-300 rounded p-1 text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[8px] font-bold text-slate-400 block mb-0.5 text-center">COA</label>
                      <input
                        type="number"
                        value={item.coa}
                        onChange={(e) => {
                          const updated = [...tempSHTI];
                          updated[idx] = { ...updated[idx], coa: Number(e.target.value) };
                          setTempSHTI(updated);
                        }}
                        className="w-full text-xs border border-slate-300 rounded p-1 text-center"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTempSHTI([...tempSHTI, { id: String(Date.now()), year: '', la: 0, lt: 0, lts: 0, coa: 0 }])}
                className="w-full py-2 border border-dashed border-sky-300 hover:bg-sky-50 rounded-xl text-xs font-bold text-sky-600 flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris SHTI Baru</span>
              </button>
            </div>
          )}

          {editingSection === 'goals' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-wide block mb-1">Narasi Deskripsi Tujuan Utama</label>
              <textarea
                value={tempGoals}
                onChange={(e) => setTempGoals(e.target.value)}
                rows={5}
                className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium leading-relaxed"
                placeholder="Meningkatkan pengawasan, akurasi data..."
              />
            </div>
          )}

          {editingSection === 'skkp_recap' && (
            <div className="space-y-6">
              {/* Editor Petugas SKKP */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Daftar Petugas SKKP</h5>
                    <p className="text-[10px] text-slate-500 font-medium">Kelola nama dan posisi penugasan petugas SKKP</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newId = String(Date.now());
                      setTempSkkpOfficers([...tempSkkpOfficers, { id: newId, name: '', position: '' }]);
                    }}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Petugas</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {tempSkkpOfficers.map((officer, index) => (
                    <div key={officer.id || index} className="flex gap-2 items-center">
                      <div className="grid grid-cols-2 gap-2 flex-1">
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 block mb-0.5 uppercase">Nama Petugas</span>
                          <input
                            type="text"
                            placeholder="Nama Petugas"
                            value={officer.name}
                            onChange={(e) => {
                              const updated = [...tempSkkpOfficers];
                              updated[index].name = e.target.value;
                              setTempSkkpOfficers(updated);
                            }}
                            className="w-full border border-slate-300 rounded p-1.5 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-sky-500 bg-white"
                          />
                        </div>
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 block mb-0.5 uppercase">Penempatan / Posisi</span>
                          <input
                            type="text"
                            placeholder="Penempatan / Posisi"
                            value={officer.position}
                            onChange={(e) => {
                              const updated = [...tempSkkpOfficers];
                              updated[index].position = e.target.value;
                              setTempSkkpOfficers(updated);
                            }}
                            className="w-full border border-slate-300 rounded p-1.5 text-xs font-medium text-slate-600 focus:outline-hidden focus:border-sky-500 bg-white"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTempSkkpOfficers(tempSkkpOfficers.filter((_, i) => i !== index));
                        }}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer border border-red-100 shrink-0 self-end mb-[1px]"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {tempSkkpOfficers.length === 0 && (
                    <div className="text-center py-4 text-slate-400 font-medium text-xs">
                      Belum ada data petugas SKKP. Klik tombol "Tambah Petugas" untuk memulai.
                    </div>
                  )}
                </div>
              </div>

              {/* Rekap SKKP Lokasi */}
              <div className="space-y-4 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider">Rekap Penerbitan SKKP</h5>
                    <p className="text-[10px] text-slate-500 font-medium">Ubah jumlah penerbitan SKKP per Triwulan</p>
                  </div>
                </div>

                {/* Year tabs */}
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {tempSkkpRecap.map((yearData) => (
                    <button
                      key={yearData.year}
                      type="button"
                      onClick={() => setActiveRecapYear(yearData.year)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeRecapYear === yearData.year
                          ? 'bg-white text-slate-800 shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Tahun {yearData.year}
                    </button>
                  ))}
                </div>

                {/* Editing active year locations */}
                {tempSkkpRecap.filter(y => y.year === activeRecapYear).map((yearData) => {
                  const bantenIndices = yearData.locations
                    .map((loc, idx) => ({ loc, idx }))
                    .filter(item => item.loc.region === 'Banten');
                  
                  const lampungIndices = yearData.locations
                    .map((loc, idx) => ({ loc, idx }))
                    .filter(item => item.loc.region === 'Lampung');

                  const updateValue = (locIdx: number, field: 'q1' | 'q2' | 'q3' | 'q4', val: number) => {
                    const updatedRecap = [...tempSkkpRecap];
                    const yearToEdit = updatedRecap.find(y => y.year === activeRecapYear);
                    if (yearToEdit) {
                      yearToEdit.locations[locIdx] = {
                        ...yearToEdit.locations[locIdx],
                        [field]: val
                      };
                      setTempSkkpRecap(updatedRecap);
                    }
                  };

                  return (
                    <div key={yearData.year} className="space-y-4">
                      {/* Banten Header */}
                      <div className="border-b border-sky-100 pb-1">
                        <span className="text-[10px] font-black text-sky-800 tracking-wider">A. LOKASI BANTEN</span>
                      </div>
                      <div className="space-y-2">
                        {bantenIndices.map(({ loc, idx }) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-150 text-[11px]">
                            <span className="font-bold text-slate-700 w-full sm:w-1/3">{loc.name}</span>
                            <div className="grid grid-cols-4 gap-2 flex-1">
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q1</span>
                                <input
                                  type="number"
                                  value={loc.q1}
                                  onChange={(e) => updateValue(idx, 'q1', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q2</span>
                                <input
                                  type="number"
                                  value={loc.q2}
                                  onChange={(e) => updateValue(idx, 'q2', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q3</span>
                                <input
                                  type="number"
                                  value={loc.q3}
                                  onChange={(e) => updateValue(idx, 'q3', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q4</span>
                                <input
                                  type="number"
                                  value={loc.q4}
                                  onChange={(e) => updateValue(idx, 'q4', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Lampung Header */}
                      <div className="border-b border-teal-100 pb-1 pt-2">
                        <span className="text-[10px] font-black text-teal-800 tracking-wider">B. LOKASI LAMPUNG</span>
                      </div>
                      <div className="space-y-2">
                        {lampungIndices.map(({ loc, idx }) => (
                          <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-150 text-[11px]">
                            <span className="font-bold text-slate-700 w-full sm:w-1/3">{loc.name}</span>
                            <div className="grid grid-cols-4 gap-2 flex-1">
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q1</span>
                                <input
                                  type="number"
                                  value={loc.q1}
                                  onChange={(e) => updateValue(idx, 'q1', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q2</span>
                                <input
                                  type="number"
                                  value={loc.q2}
                                  onChange={(e) => updateValue(idx, 'q2', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q3</span>
                                <input
                                  type="number"
                                  value={loc.q3}
                                  onChange={(e) => updateValue(idx, 'q3', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                              <div>
                                <span className="text-[8px] font-bold text-slate-400 block text-center mb-0.5">Q4</span>
                                <input
                                  type="number"
                                  value={loc.q4}
                                  onChange={(e) => updateValue(idx, 'q4', Number(e.target.value))}
                                  className="w-full border border-slate-300 rounded p-1 text-center font-mono font-semibold text-xs focus:outline-hidden focus:border-sky-500 bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>

      </div>
    </div>
  );
}
