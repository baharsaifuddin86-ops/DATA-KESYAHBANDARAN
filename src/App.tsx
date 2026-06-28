import { useState, useEffect, startTransition } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Port, Region } from './types';
import { defaultPorts } from './data/defaultPorts';
import MapComponent from './components/MapComponent';
import PortListPanel from './components/PortListPanel';
import PortDetailCard from './components/PortDetailCard';
import StatsDashboard from './components/StatsDashboard';
import PortFormModal from './components/PortFormModal';
import { AnimatePresence, motion } from 'motion/react';
import FisheryPortLogo from './components/FisheryPortLogo';
import { 
  Anchor, 
  Map, 
  BarChart3, 
  Info, 
  HelpCircle, 
  Database, 
  FileText,
  AlertCircle
} from 'lucide-react';

export default function App() {
  // Ports Database State
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedPortId, setSelectedPortId] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<'Banten' | 'Lampung' | 'All'>('All');
  
  // Interaction/Creation States
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ latitude: number; longitude: number; region: Region } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPort, setEditingPort] = useState<Port | null>(null);

  // Active primary view: 'dashboard' (Initial statistics/infographics) or 'ports' (Interactive map & list)
  const [activeView, setActiveView] = useState<'dashboard' | 'ports'>('dashboard');

  // Load ports from localStorage or fallback to default dataset and sync with Firestore
  useEffect(() => {
    const saved = localStorage.getItem('sinfonik_ports');
    const savedTimeStr = localStorage.getItem('sinfonik_ports_updated_at');
    const localTime = savedTimeStr ? Number(savedTimeStr) : 0;
    
    let localPorts: Port[] = [];
    if (saved) {
      try {
        let parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Filter out deleted ports (Binuangeun, Bayah, Labuhan Maringgai, Muara Gading Mas, Margasari, Kuala Penet)
          const deletedIds = ['port-banten-3', 'port-banten-5', 'port-lampungtimur-1', 'port-lampungtimur-2', 'port-lampungtimur-3', 'port-lampungtimur-4'];
          parsed = parsed.filter((p: any) => !deletedIds.includes(p.id));
          localPorts = parsed;
        }
      } catch (e) {
        console.error("Gagal memuat data lokal, menggunakan default.", e);
      }
    }
    
    // Ensure default required ports are present if we started with fallback
    if (localPorts.length === 0) {
      localPorts = defaultPorts;
    }

    const docRef = doc(db, 'ports', 'main');

    const syncPorts = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const cloudData = snap.data() as { list: Port[]; updatedAt?: number };
          const cloudTime = cloudData.updatedAt || 0;
          
          if (localPorts.length > 0 && localTime > cloudTime) {
            console.log("Local ports database is newer. Syncing to Cloud...");
            await setDoc(docRef, { list: localPorts, updatedAt: localTime });
            setPorts(localPorts);
          } else {
            console.log("Cloud ports database is newer/same. Loading from Cloud...");
            setPorts(cloudData.list);
            localStorage.setItem('sinfonik_ports', JSON.stringify(cloudData.list));
            localStorage.setItem('sinfonik_ports_updated_at', String(cloudTime));
          }
        } else {
          console.log("No cloud ports database found. Uploading local data...");
          const uploadTime = localTime || Date.now();
          await setDoc(docRef, { list: localPorts, updatedAt: uploadTime });
          setPorts(localPorts);
          localStorage.setItem('sinfonik_ports', JSON.stringify(localPorts));
          localStorage.setItem('sinfonik_ports_updated_at', String(uploadTime));
        }
      } catch (err) {
        console.error("Error syncing ports database:", err);
        // Fallback to local
        setPorts(localPorts);
      }
    };

    syncPorts();

    // Listen for real-time cloud data changes
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as { list: Port[]; updatedAt?: number };
        const cloudTime = cloudData.updatedAt || 0;
        
        setPorts((currentLocal) => {
          const savedTimeStr = localStorage.getItem('sinfonik_ports_updated_at');
          const currentLocalTime = savedTimeStr ? Number(savedTimeStr) : 0;
          
          if (cloudTime >= currentLocalTime) {
            localStorage.setItem('sinfonik_ports', JSON.stringify(cloudData.list));
            localStorage.setItem('sinfonik_ports_updated_at', String(cloudTime));
            return cloudData.list;
          }
          return currentLocal;
        });
      }
    }, (error) => {
      console.error("Firestore listen error for ports:", error);
    });

    return () => unsubscribe();
  }, []);

  // Set default selected port if not set
  useEffect(() => {
    if (ports.length > 0 && !selectedPortId) {
      const lempasingExists = ports.some(p => p.id === 'port-lampung-lempasing');
      if (lempasingExists) {
        setSelectedPortId('port-lampung-lempasing');
      } else {
        setSelectedPortId(ports[0].id);
      }
    }
  }, [ports, selectedPortId]);

  // Save to LocalStorage and Firestore whenever ports database changes
  const savePortsToStorage = async (updatedPorts: Port[]) => {
    setPorts(updatedPorts);
    const now = Date.now();
    localStorage.setItem('sinfonik_ports', JSON.stringify(updatedPorts));
    localStorage.setItem('sinfonik_ports_updated_at', String(now));
    
    try {
      const docRef = doc(db, 'ports', 'main');
      await setDoc(docRef, { list: updatedPorts, updatedAt: now });
    } catch (err) {
      console.error("Error saving ports to Firestore:", err);
    }
  };

  // Select Port Handler
  const handleSelectPort = (id: string) => {
    setSelectedPortId(id);
    setActiveView('ports'); // Automatically switch to ports view when selected!
  };

  // Map Click Handler (to determine port points!)
  const handleMapClick = (lat: number, lng: number, region: Region) => {
    if (isAddingNew) {
      setPendingCoords({ latitude: lat, longitude: lng, region });
      setEditingPort(null);
      setIsModalOpen(true);
      setIsAddingNew(false); // turn off click-mode once point selected
    }
  };

  // Add / Edit save handler
  const handleSavePort = (savedPort: Port) => {
    let finalPort = savedPort;

    let updated: Port[];
    if (editingPort) {
      // Update existing
      updated = ports.map(p => p.id === finalPort.id ? finalPort : p);
    } else {
      // Create new
      updated = [finalPort, ...ports];
    }
    
    savePortsToStorage(updated);
    setSelectedPortId(savedPort.id);
    setIsModalOpen(false);
    setPendingCoords(null);
    setEditingPort(null);
    setActiveView('ports'); // focus on the port we just saved!
  };

  // Delete handler
  const handleDeletePort = (id: string) => {
    const updated = ports.filter(p => p.id !== id);
    savePortsToStorage(updated);
    
    if (selectedPortId === id) {
      setSelectedPortId(updated.length > 0 ? updated[0].id : null);
      setActiveView('dashboard');
    }
  };

  // Edit CTA trigger
  const handleTriggerEdit = (port: Port) => {
    setEditingPort(port);
    setPendingCoords(null);
    setIsModalOpen(true);
  };

  // Import JSON list handler
  const handleImportPorts = (importedList: Port[]) => {
    savePortsToStorage(importedList);
    if (importedList.length > 0) {
      setSelectedPortId(importedList[0].id);
      setActiveView('ports');
    }
  };

  // Deep-link from Dashboard table directly to map marker
  const handlePortClickFromDashboard = (portId: string) => {
    setSelectedPortId(portId);
    setActiveView('ports');
  };

  const selectedPort = ports.find(p => p.id === selectedPortId) || null;

  return (
    <div className="min-h-screen bg-[#f0f7fc] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.12),rgba(255,255,255,0))] flex flex-col font-sans antialiased text-slate-800">
      
      {/* 1. Global Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-sky-100 sticky top-0 z-[1000] px-6 py-4 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white rounded-xl shadow-xs border border-sky-100 flex items-center justify-center shrink-0 p-0.5">
              <FisheryPortLogo size={38} className="hover:scale-105 transition-transform" />
            </div>
            <div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-display font-extrabold text-lg md:text-xl text-sky-950 tracking-tight leading-none">
                    Data Kesyahbandaran PPN Karangantu dan Pelabuhan Binaan
                  </h1>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold leading-none">
                  Sistem Informasi dan Infografis Sebaran Pelabuhan Binaan PPN Karangantu
                </p>
              </div>
            </div>
          </div>

          {/* Quick status badges */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-sky-100 shadow-2xs">
              <Database className="w-4 h-4 text-sky-600" />
              <span className="text-slate-500 font-medium">Database:</span>
              <strong className="text-slate-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cloud Firestore ({ports.length})
              </strong>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-sky-100 text-slate-500 shadow-2xs">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Sesi Sinkron</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Top-Level Navigation Tab Bar */}
      <div className="bg-white border-b border-sky-100 py-3 px-6 shrink-0 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-sky-100/75 self-start sm:self-auto">
            <button
              onClick={() => startTransition(() => setActiveView('dashboard'))}
              className={`px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeView === 'dashboard'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard & Infografis Wilayah</span>
            </button>
            <button
              onClick={() => startTransition(() => setActiveView('ports'))}
              className={`px-5 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-2 ${
                activeView === 'ports'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Peta & Daftar Pelabuhan Binaan</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>Tampilan aktif: <strong className="text-slate-700">{activeView === 'dashboard' ? 'Dashboard Utama (Awal)' : 'Peta Interaktif & Daftar'}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Layout Area (Dynamic Views Switcher) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' ? (
            <motion.main
              key="dashboard-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6"
            >
              <StatsDashboard 
                ports={ports} 
                onSelectRegion={setSelectedRegion} 
                selectedRegion={selectedRegion}
                onPortClick={handlePortClickFromDashboard}
              />
            </motion.main>
          ) : (
            <motion.main
              key="ports-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-5"
            >
              {/* Top Section - Search, Filter, concise list panel */}
              <PortListPanel
                ports={ports}
                selectedPortId={selectedPortId}
                onSelectPort={handleSelectPort}
                onAddNewClick={() => setIsAddingNew(!isAddingNew)}
                onEditClick={handleTriggerEdit}
                onDeleteClick={handleDeletePort}
                onImportPorts={handleImportPorts}
                isAddingNew={isAddingNew}
              />

              {/* Middle Section: Leaflet Interactive Map (Full Width) */}
              <div className="h-[450px] md:h-[580px] w-full shrink-0">
                <MapComponent
                  ports={ports}
                  selectedPortId={selectedPortId}
                  onSelectPort={handleSelectPort}
                  onMapClick={handleMapClick}
                  isAddingNew={isAddingNew}
                  pendingCoords={pendingCoords}
                />
              </div>

              {/* Bottom Section: Dedicated Port Details Card (Full Width) */}
              <div className="w-full min-h-[350px]">
                {selectedPort ? (
                  <PortDetailCard 
                    port={selectedPort} 
                    onEditClick={handleTriggerEdit}
                  />
                ) : (
                  <div className="w-full h-full bg-white border border-sky-100 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 shadow-md">
                    <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center animate-pulse">
                      <FisheryPortLogo size={42} />
                    </div>
                    <div className="max-w-xs">
                      <h3 className="font-display font-bold text-base text-sky-950 tracking-tight">Tidak Ada Pelabuhan Terpilih</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Pilih salah satu penanda pelabuhan di peta atau daftar di atas untuk menampilkan informasi kesyahbandaran lengkap.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Creation / Modification Modal Form */}
      <PortFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setPendingCoords(null);
          setEditingPort(null);
        }}
        onSave={handleSavePort}
        editingPort={editingPort}
        initialCoords={pendingCoords}
      />

      {/* 5. Elegant Minimal Footer */}
      <footer className="bg-white border-t border-sky-100 py-4 px-6 text-center text-[10px] text-slate-500 font-medium shrink-0 shadow-2xs">
        <p>© 2026 DATA KESYAHBANDARAN — Sistem Informasi & Infografis Sebaran Pelabuhan Binaan PPN Karangantu, Provinsi Banten & Lampung.</p>
        <p className="mt-1">Dibuat menggunakan data rujukan Dinas Kelautan & Perikanan wilayah terkait.</p>
      </footer>
    </div>
  );
}
