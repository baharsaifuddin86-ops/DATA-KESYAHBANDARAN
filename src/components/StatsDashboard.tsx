import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Port, PortClass } from '../types';
import InfographicModal from './InfographicModal';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as ChartTooltip, 
  Cell, 
  PieChart, 
  Pie 
} from 'recharts';
import { 
  Anchor, Shield, Ship, Award, TrendingUp, Compass, Grid, AlertCircle,
  AlertTriangle, Users, Target, FileText, CheckCircle2, TrendingDown,
  DollarSign, Calendar, MapPin, Sparkles, Activity, Pencil, Trash2, Plus, X, Save, RotateCcw
} from 'lucide-react';

export interface BinaanPort {
  id: number;
  name: string;
  loc: string;
}

export interface SKKPApplication {
  id: string;
  year: string;
  count: number;
}

export interface MigrantVessel {
  id: string;
  portName: string;
  count: number;
}

export interface PNBPPercentile {
  id: string;
  year: string;
  amount: string;
}

export interface SyahbandarOfficer {
  id: string;
  no: number;
  name: string;
  ports: string[];
}

export interface BinaanVesselCount {
  id: string;
  name: string;
  count: number;
}

export interface GeneralProblem {
  id: string;
  title: string;
  text1: string;
  text2: string;
  plan: string;
}

export interface PNBPDecreaseFactor {
  id: string;
  no: number;
  text: string;
}

export interface SHTIApplication {
  id: string;
  year: string;
  la: number;
  lt: number;
  lts: number;
  coa: number;
}

export interface SkkpRecapLocation {
  name: string;
  region: 'Banten' | 'Lampung';
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  officerName?: string;
  officerPosition?: string;
}

export interface SkkpRecapYear {
  year: string;
  locations: SkkpRecapLocation[];
}

export interface SkkpOfficer {
  id: string;
  name: string;
  position: string;
}

export interface PnbpSdaAchievement {
  id: string;
  portName: string;
  amount2025: number;
  amount2026: number;
}

export interface InfographicState {
  title: string;
  subtitle: string;
  periodLabel: string;
  binaanPorts: BinaanPort[];
  skkpApplications: SKKPApplication[];
  migrantVessels: MigrantVessel[];
  pnbpAchievements: PNBPPercentile[];
  syahbandarDistribution: SyahbandarOfficer[];
  binaanVesselCounts: BinaanVesselCount[];
  generalProblems: GeneralProblem[];
  pnbpDecreaseFactors: PNBPDecreaseFactor[];
  shtiApplications: SHTIApplication[];
  goals: string;
  skkpRecap?: SkkpRecapYear[];
  skkpOfficers?: SkkpOfficer[];
  pnbpSdaAchievements?: PnbpSdaAchievement[];
  updatedAt?: number;
}

const DEFAULT_INFOGRAPHIC_DATA: InfographicState = {
  title: "PPN Karangantu dan Pelabuhan Binaan",
  subtitle: "Seksi Kesyahbandaran & Tata Kelola Pelabuhan Perikanan Nusantara Karangantu",
  periodLabel: "PERIODE AKTIF",
  skkpOfficers: [
    { id: '1', name: 'Dedi Sutriyono', position: 'PPN Karangantu' },
    { id: '2', name: 'Ahmad Tohir', position: 'PPN Karangantu' },
    { id: '3', name: 'Murlian Aprianto', position: 'PPN Karangantu' },
    { id: '4', name: 'Wahyu', position: 'PPN Karangantu' },
    { id: '5', name: 'Tukimun', position: 'PPN Karangantu' },
    { id: '6', name: 'Agung Muslim', position: 'PPN Karangantu' },
    { id: '7', name: 'Gellen Nendo', position: 'PP Kuala Penet' }
  ],
  binaanPorts: [
    { id: 1, name: 'Kronjo', loc: 'Kab. Tangerang' },
    { id: 2, name: 'Cituis', loc: 'Kab. Tangerang' },
    { id: 3, name: 'Labuan', loc: 'Kab. Pandeglang' },
    { id: 4, name: 'Panimbang', loc: 'Kab. Pandeglang' },
    { id: 5, name: 'Lempasing', loc: 'Kota Bandar Lampung' },
    { id: 6, name: 'Kuala Penet', loc: 'Kab. Lampung Timur' }
  ],
  skkpApplications: [
    { id: '1', year: 'Tahun Lalu', count: 267 },
    { id: '2', year: 'Tahun Ini', count: 69 }
  ],
  migrantVessels: [
    { id: '1', portName: 'Kuala Penet', count: 74 }
  ],
  pnbpAchievements: [
    { id: '1', year: 'Tahun Lalu', amount: 'Rp 124.066.155,-' },
    { id: '2', year: 'Tahun Ini', amount: 'Rp 136.187.725,-' }
  ],
  syahbandarDistribution: [
    { id: '1', no: 1, name: 'Murlian Aprianto', ports: ['PPN Karangantu', 'PP Kronjo'] },
    { id: '2', no: 2, name: 'Tukimun', ports: ['PPN Karangantu'] },
    { id: '3', no: 3, name: 'Ari Rahman', ports: ['PP Cituis', 'PP Labuan', 'PP Panimbang'] },
    { id: '4', no: 4, name: 'Gellen Nendo Perdana', ports: ['PP Lempasing', 'PP Kuala Penet'] }
  ],
  binaanVesselCounts: [
    { id: '1', name: 'PPN Karangantu', count: 361 },
    { id: '2', name: 'PP Lempasing', count: 128 },
    { id: '3', name: 'PP Kuala Penet', count: 72 },
    { id: '4', name: 'PP Panimbang', count: 63 },
    { id: '5', name: 'PP Kronjo', count: 20 },
    { id: '6', name: 'PP Cituis', count: 7 }
  ],
  pnbpSdaAchievements: [
    { id: '1', portName: 'PP. Muara Piluk', amount2025: 34755270, amount2026: 1260850 },
    { id: '2', portName: 'PP. Kuala Penet', amount2025: 124066155, amount2026: 136187725 },
    { id: '3', portName: 'PP. Labuhan Maringgai', amount2025: 0, amount2026: 0 }
  ],
  generalProblems: [
    {
      id: '1',
      title: "Aktivitas Tambat Labuh & Pendangkalan",
      text1: "Banyaknya kapal bersandar dan memanfaatkan fasilitas tambat labuh/dermaga milik negara di wilayah PPN Karangantu tanpa aktivitas operasional yang jelas dan/atau belum memenuhi ketentuan administrasi sesuai peraturan yang berlaku.",
      text2: "Setelah diklarifikasi, pada umumnya mereka bersandar sementara karena kesulitan menuju tangkahan yang disebabkan oleh pendangkalan arus sungai.",
      plan: "Akan dimulai pengerukan sungai kali sultan dengan harapan kapal-kapal akan nyaman melalui alur pelayaran dan tidak mengganggu aktivitas pelayaran."
    }
  ],
  pnbpDecreaseFactors: [
    { id: '1', no: 1, text: 'Pengawasan lebih ketat, sehingga kapal yang tidak patuh atau tidak memiliki izin lengkap mengurangi aktivitas / berhenti beroperasi.' },
    { id: '2', no: 2, text: 'Data produksi lebih akurat, sehingga hasil tangkapan dasar perhitungan PNBP tercatat sesuai kondisi rill di lapangan.' },
    { id: '3', no: 3, text: 'Berkurangnya pelanggaran and unreported fishing, sehingga volume tangkapan sebelumnya tidak lagi tersaring tanpa laporan.' },
    { id: '4', no: 4, text: 'Masa adaptasi pelaku usaha terhadap kewajiban VMS dan sistem pelaporan elektronik baru.' }
  ],
  shtiApplications: [
    { id: '1', year: '2025', la: 27, lt: 3293, lts: 101, coa: 32 },
    { id: '2', year: '2026', la: 60, lt: 2239, lts: 103, coa: 82 }
  ],
  goals: "Meningkatkan pengawasan, akurasi data, dan kepatuhan pelaku usaha guna mendukung optimalisasi penerimaan PNBP serta kelancaran aktivitas pelayaran di wilayah PPN Karangantu dan pelabuhan binaan.",
  skkpRecap: [
    {
      year: "2025",
      locations: [
        { name: "PP Cituis", region: "Banten", q1: 0, q2: 0, q3: 5, q4: 0, officerName: "Ahmad Fauzi, S.St.Pi", officerPosition: "Petugas SKKP Cituis" },
        { name: "PP Krojo", region: "Banten", q1: 5, q2: 3, q3: 11, q4: 2, officerName: "Dedi Susanto, A.Md", officerPosition: "Petugas SKKP Krojo" },
        { name: "PPN Karangantu", region: "Banten", q1: 4, q2: 4, q3: 16, q4: 6, officerName: "Hendra Wijaya, S.Pi", officerPosition: "Syahbandar Karangantu" },
        { name: "Pulau Tunda", region: "Banten", q1: 0, q2: 0, q3: 0, q4: 0, officerName: "Slamet Riyadi", officerPosition: "Petugas Wilayah Pulau Tunda" },
        { name: "PP Pulo Kali", region: "Banten", q1: 0, q2: 0, q3: 0, q4: 0, officerName: "Rudi Hermawan", officerPosition: "Petugas Pulo Kali" },
        { name: "PP Panimbang", region: "Banten", q1: 0, q2: 0, q3: 0, q4: 2, officerName: "Budi Setiawan, S.Pi", officerPosition: "Petugas Panimbang" },
        { name: "PP Sidamukti", region: "Banten", q1: 0, q2: 0, q3: 0, q4: 4, officerName: "Andi Wijaya", officerPosition: "Petugas Sidamukti" },
        { name: "PP Lempasing", region: "Lampung", q1: 43, q2: 33, q3: 59, q4: 38, officerName: "Agus Pratama, S.St.Pi", officerPosition: "Syahbandar Lempasing" },
        { name: "PP Kali anda", region: "Lampung", q1: 2, q2: 0, q3: 0, q4: 0, officerName: "Iwan Setiawan", officerPosition: "Petugas Kalianda" },
        { name: "PP Muara Piluk", region: "Lampung", q1: 6, q2: 0, q3: 4, q4: 7, officerName: "M. Yusuf, A.Md", officerPosition: "Petugas Muara Piluk" },
        { name: "PP Maringgai", region: "Lampung", q1: 12, q2: 0, q3: 0, q4: 0, officerName: "Rahmat Hidayat", officerPosition: "Petugas Maringgai" },
        { name: "PP Kuala Penet", region: "Lampung", q1: 1, q2: 0, q3: 0, q4: 0, officerName: "Syarifuddin, S.Pi", officerPosition: "Petugas Kuala Penet" }
      ]
    },
    {
      year: "2026",
      locations: [
        { name: "PP Cituis", region: "Banten", q1: 1, q2: 0, q3: 0, q4: 0, officerName: "Ahmad Fauzi, S.St.Pi", officerPosition: "Petugas SKKP Cituis" },
        { name: "PP Krojo", region: "Banten", q1: 5, q2: 1, q3: 0, q4: 0, officerName: "Dedi Susanto, A.Md", officerPosition: "Petugas SKKP Krojo" },
        { name: "PPN Karangantu", region: "Banten", q1: 3, q2: 3, q3: 0, q4: 0, officerName: "Hendra Wijaya, S.Pi", officerPosition: "Syahbandar Karangantu" },
        { name: "Pulau Tunda", region: "Banten", q1: 0, q2: 0, q3: 0, q4: 0, officerName: "Slamet Riyadi", officerPosition: "Petugas Wilayah Pulau Tunda" },
        { name: "PP Pulo Kali", region: "Banten", q1: 0, q2: 0, q3: 0, q4: 0, officerName: "Rudi Hermawan", officerPosition: "Petugas Pulo Kali" },
        { name: "PP Panimbang", region: "Banten", q1: 0, q2: 5, q3: 0, q4: 0, officerName: "Budi Setiawan, S.Pi", officerPosition: "Petugas Panimbang" },
        { name: "PP Sidamukti", region: "Banten", q1: 0, q2: 3, q3: 0, q4: 0, officerName: "Andi Wijaya", officerPosition: "Petugas Sidamukti" },
        { name: "PP Lempasing", region: "Lampung", q1: 4, q2: 41, q3: 0, q4: 0, officerName: "Agus Pratama, S.St.Pi", officerPosition: "Syahbandar Lempasing" },
        { name: "PP Kali anda", region: "Lampung", q1: 0, q2: 0, q3: 0, q4: 0, officerName: "Iwan Setiawan", officerPosition: "Petugas Kalianda" },
        { name: "PP Muara Piluk", region: "Lampung", q1: 0, q2: 4, q3: 0, q4: 0, officerName: "M. Yusuf, A.Md", officerPosition: "Petugas Muara Piluk" },
        { name: "PP Maringgai", region: "Lampung", q1: 0, q2: 0, q3: 0, q4: 0, officerName: "Rahmat Hidayat", officerPosition: "Petugas Maringgai" },
        { name: "PP Kuala Penet", region: "Lampung", q1: 0, q2: 0, q3: 0, q4: 0, officerName: "Syarifuddin, S.Pi", officerPosition: "Petugas Kuala Penet" }
      ]
    }
  ]
};

interface StatsDashboardProps {
  ports: Port[];
  onSelectRegion: (region: 'Banten' | 'Lampung' | 'All') => void;
  selectedRegion: 'Banten' | 'Lampung' | 'All';
  onPortClick?: (portId: string) => void;
}

export default function StatsDashboard({ ports, onSelectRegion, selectedRegion, onPortClick }: StatsDashboardProps) {
  // Infographics state with local storage persistence
  const [infoData, setInfoData] = useState<InfographicState>(() => {
    const saved = localStorage.getItem('syahbandar_infographics_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.skkpRecap) {
          parsed.skkpRecap = DEFAULT_INFOGRAPHIC_DATA.skkpRecap;
        }
        if (!parsed.skkpOfficers) {
          parsed.skkpOfficers = DEFAULT_INFOGRAPHIC_DATA.skkpOfficers;
        }
        if (!parsed.pnbpSdaAchievements) {
          parsed.pnbpSdaAchievements = DEFAULT_INFOGRAPHIC_DATA.pnbpSdaAchievements;
        }
        if (parsed.shtiApplications) {
          parsed.shtiApplications = parsed.shtiApplications.map((item: any) => {
            if (item.year === 'Tahun Lalu') {
              return { ...item, year: '2025' };
            }
            if (item.year === 'Tahun Ini') {
              return { ...item, year: '2026' };
            }
            return item;
          });
        } else {
          parsed.shtiApplications = DEFAULT_INFOGRAPHIC_DATA.shtiApplications;
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_INFOGRAPHIC_DATA;
  });

  // Sync with Firestore in real-time
  useEffect(() => {
    const docRef = doc(db, 'infographics', 'main');
    
    const syncData = async () => {
      try {
        const snap = await getDoc(docRef);
        const localSaved = localStorage.getItem('syahbandar_infographics_v2');
        let localData: InfographicState | null = null;
        if (localSaved) {
          try {
            localData = JSON.parse(localSaved);
          } catch (_) {}
        }

        if (snap.exists()) {
          const cloudData = snap.data() as InfographicState;
          
          // Compare timestamps to see which is newer
          const cloudTime = cloudData.updatedAt || 0;
          const localTime = localData?.updatedAt || 0;
          
          if (localData && localTime > cloudTime) {
            // Local is newer, upload to Firestore
            console.log("Local infographics data is newer. Syncing to Cloud...");
            await setDoc(docRef, localData);
            setInfoData(localData);
          } else {
            // Cloud is newer (or same), load from Cloud
            console.log("Cloud infographics data is newer/same. Loading from Cloud...");
            setInfoData(cloudData);
            localStorage.setItem('syahbandar_infographics_v2', JSON.stringify(cloudData));
          }
        } else {
          // Cloud doesn't exist, upload local data or defaults
          console.log("No cloud infographics data found. Uploading local/default data...");
          const initialData = localData || infoData;
          const dataToUpload = { ...initialData, updatedAt: initialData.updatedAt || Date.now() };
          await setDoc(docRef, dataToUpload);
          setInfoData(dataToUpload);
          localStorage.setItem('syahbandar_infographics_v2', JSON.stringify(dataToUpload));
        }
      } catch (err) {
        console.error("Error syncing infographics:", err);
      }
    };

    syncData();

    // Listen for real-time cloud data changes
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudData = docSnap.data() as InfographicState;
        
        // Only update if cloud has newer data than currently loaded state
        setInfoData((currentLocal) => {
          const cloudTime = cloudData.updatedAt || 0;
          const localTime = currentLocal?.updatedAt || 0;
          if (cloudTime >= localTime) {
            localStorage.setItem('syahbandar_infographics_v2', JSON.stringify(cloudData));
            return cloudData;
          }
          return currentLocal;
        });
      }
    }, (error) => {
      console.error("Firestore listen error:", error);
    });

    return () => unsubscribe();
  }, []);

  const saveInfoData = async (newData: InfographicState) => {
    const dataWithTimestamp = { ...newData, updatedAt: Date.now() };
    setInfoData(dataWithTimestamp);
    localStorage.setItem('syahbandar_infographics_v2', JSON.stringify(dataWithTimestamp));
    try {
      const docRef = doc(db, 'infographics', 'main');
      await setDoc(docRef, dataWithTimestamp);
    } catch (err) {
      console.error("Error saving data to Firestore:", err);
    }
  };

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const openEditSection = (section: string) => {
    setEditingSection(section);
  };

  const handleSaveSection = (section: string, data: any) => {
    if (section === 'banner') {
      saveInfoData({
        ...infoData,
        title: data.title,
        subtitle: data.subtitle,
        periodLabel: data.periodLabel
      });
    } else if (section === 'binaan') {
      saveInfoData({ ...infoData, binaanPorts: data });
    } else if (section === 'skkp') {
      saveInfoData({ ...infoData, skkpApplications: data });
    } else if (section === 'migrant') {
      saveInfoData({ ...infoData, migrantVessels: data });
    } else if (section === 'pnbp') {
      saveInfoData({ ...infoData, pnbpAchievements: data });
    } else if (section === 'syahbandar') {
      saveInfoData({ ...infoData, syahbandarDistribution: data });
    } else if (section === 'vessel_counts') {
      saveInfoData({ ...infoData, binaanVesselCounts: data });
    } else if (section === 'problems') {
      saveInfoData({ ...infoData, generalProblems: data });
    } else if (section === 'factors') {
      saveInfoData({ ...infoData, pnbpDecreaseFactors: data });
    } else if (section === 'pnbp_sda') {
      saveInfoData({ ...infoData, pnbpSdaAchievements: data });
    } else if (section === 'shti') {
      saveInfoData({ ...infoData, shtiApplications: data });
    } else if (section === 'goals') {
      saveInfoData({ ...infoData, goals: data });
    } else if (section === 'skkp_recap') {
      saveInfoData({ 
        ...infoData, 
        skkpRecap: data.skkpRecap, 
        skkpOfficers: data.skkpOfficers 
      });
    }
    setEditingSection(null);
  };

  const handleResetToDefault = () => {
    if (window.confirm("Apakah Anda yakin ingin mengatur ulang data infografis ke data bawaan resmi? Semua perubahan Anda akan dihapus.")) {
      saveInfoData(DEFAULT_INFOGRAPHIC_DATA);
      setIsEditMode(false);
    }
  };

  // Filter ports based on active region tab
  const filteredPorts = ports.filter(p => selectedRegion === 'All' || p.region === selectedRegion);

  // Math Calculations
  const totalPorts = filteredPorts.length;
  const totalVessels = filteredPorts.reduce((acc, p) => acc + p.activeVessels, 0);

  const bantenCount = ports.filter(p => p.region === 'Banten').length;
  const lampungCount = ports.filter(p => p.region === 'Lampung').length;

  // Class Distribution
  const classDistribution = filteredPorts.reduce((acc, port) => {
    acc[port.class] = (acc[port.class] || 0) + 1;
    return acc;
  }, {} as Record<PortClass, number>);

  const classData = [
    { name: 'PPS (Samudera)', value: classDistribution['PPS'] || 0, color: '#6366f1' },
    { name: 'PPN (Nusantara)', value: classDistribution['PPN'] || 0, color: '#06b6d4' },
    { name: 'PPP (Pantai)', value: classDistribution['PPP'] || 0, color: '#10b981' },
    { name: 'PPI (Pendaratan)', value: classDistribution['PPI'] || 0, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  // Permit Type Distribution (Daerah vs Pusat)
  const permitDistribution = filteredPorts.reduce((acc, port) => {
    const daerahVal = port.permitType?.daerah ?? port.activeVessels;
    const pusatVal = port.permitType?.pusat ?? 0;
    acc.daerah += daerahVal;
    acc.pusat += pusatVal;
    return acc;
  }, { daerah: 0, pusat: 0 });

  const permitData = [
    { name: 'Daerah (Provinsi/Kab)', value: permitDistribution.daerah, color: '#0284c7' },
    { name: 'Pusat (Kementerian KKP)', value: permitDistribution.pusat, color: '#ea580c' },
  ].filter(d => d.value > 0);

  const totalPermits = permitDistribution.daerah + permitDistribution.pusat;

  // Dominant Fishing Gear Distribution
  const gearDistribution = filteredPorts.reduce((acc, port) => {
    const gear = port.dominantFishingGear || 'Jaring Tarik Berkantong';
    acc[gear] = (acc[gear] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const gearData = Object.entries(gearDistribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const mostDominantGear = gearData[0]?.name || 'N/A';
  const mostDominantGearCount = gearData[0]?.value || 0;

  // Vessel comparison by region (only relevant when selectedRegion is 'All')
  const regionVesselData = [
    {
      name: 'Banten',
      Kapal: ports.filter(p => p.region === 'Banten').reduce((acc, p) => acc + p.activeVessels, 0),
    },
    {
      name: 'Lampung',
      Kapal: ports.filter(p => p.region === 'Lampung').reduce((acc, p) => acc + p.activeVessels, 0),
    },
  ];

  // Top Commodities counting (frequency across ports)
  const commodityCounts: Record<string, number> = {};
  filteredPorts.forEach(port => {
    port.commodities.forEach(c => {
      commodityCounts[c] = (commodityCounts[c] || 0) + 1;
    });
  });

  const topCommodities = Object.entries(commodityCounts)
    .map(([name, count]) => ({ name, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Extract all documented issues/problems from filtered ports
  const allProblems = filteredPorts
    .filter(port => port.problems && port.problems.length > 0)
    .flatMap(port => (port.problems || []).map(prob => ({ portName: port.name, text: prob })));

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Dynamic Infographics Panel representing official data, fully interactive and editable */}
      <div className="flex flex-col gap-6 w-full animate-fadeIn relative text-slate-700">
          
          {/* Main Infographic Banner */}
          <div className="relative group overflow-hidden bg-gradient-to-r from-sky-950 via-sky-900 to-blue-900 text-white rounded-3xl p-6 md:p-8 border border-sky-850 shadow-lg">
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent opacity-60 rounded-r-3xl pointer-events-none" />
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-sky-600/5 rounded-full blur-2xl pointer-events-none" />
            
            {/* Embedded Controls Panel */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isEditMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
                <span className="text-xs text-sky-200 font-bold uppercase tracking-wider">
                  {isEditMode ? 'Mode Edit Aktif' : 'Mode Tampilan'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isEditMode
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md hover:bg-amber-600'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>{isEditMode ? 'Kunci Edit' : 'Edit Infografis'}</span>
                </button>
                {isEditMode && (
                  <button
                    onClick={() => openEditSection('banner')}
                    className="px-3 py-1.5 bg-sky-600/80 hover:bg-sky-600 text-white border border-sky-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ubah Teks Banner</span>
                  </button>
                )}
                <button
                  onClick={handleResetToDefault}
                  className="px-3 py-1.5 bg-rose-600/85 hover:bg-rose-600 text-white border border-rose-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Atur ulang ke data asli bawaan"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-sky-300 border border-white/10 shrink-0 shadow-inner">
                  <Anchor className="w-8 h-8 text-sky-400" />
                </div>
                <div>
                  <span className="text-[10px] md:text-xs font-bold tracking-wider text-sky-300 uppercase block mb-1">DATA INFOGRAFIS RESMI KESYAHBANDARAN</span>
                  <h1 className="text-xl md:text-2xl font-display font-black tracking-tight leading-tight uppercase">
                    {infoData.title}
                  </h1>
                  <p className="text-xs text-sky-200/80 mt-1 font-medium">{infoData.subtitle}</p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0">
                <div className="bg-sky-500/25 border border-sky-400/40 text-sky-100 text-[10px] md:text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  {infoData.periodLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Top 3-Column Visual Layout: Pelabuhan, Syahbandar, & Jumlah Kapal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Box 1: Pelabuhan Binaan */}
            <div className="relative group bg-white border border-sky-100 rounded-2xl shadow-md p-5 flex flex-col h-full">
              {isEditMode && (
                <button
                  onClick={() => openEditSection('binaan')}
                  className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 text-[10px] font-bold z-10 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Ubah</span>
                </button>
              )}

              <div className="flex items-center gap-2 border-b border-sky-50 pb-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Anchor className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-slate-850 tracking-wider">Pelabuhan Binaan</h4>
                  <p className="text-[10px] text-slate-500">{infoData.binaanPorts.length} lokasi di wilayah kerja pembinaan PPN Karangantu</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {infoData.binaanPorts.map((portItem, idx) => (
                  <div key={portItem.id || idx} className="p-3 bg-sky-50/40 border border-sky-100/60 rounded-xl flex items-center gap-2.5 hover:bg-sky-50 transition-colors">
                    <div className="w-6 h-6 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-slate-850 truncate leading-tight">{portItem.name}</p>
                      <p className="text-[9px] text-slate-400 font-semibold truncate mt-0.5">{portItem.loc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="text-[10px] text-slate-500 font-medium leading-normal">
                    Meliputi pelabuhan di lintas provinsi Banten & Lampung Timur.
                  </span>
                </div>
              </div>
            </div>

            {/* Box 2: Penyebaran Syahbandar */}
            <div className="relative group bg-white border border-sky-100 rounded-2xl shadow-md p-5 flex flex-col h-full min-h-[300px]">
              {isEditMode && (
                <button
                  onClick={() => openEditSection('syahbandar')}
                  className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 text-[10px] font-bold z-10 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Ubah</span>
                </button>
              )}

              <div className="flex items-center gap-2 border-b border-sky-50 pb-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-slate-850 tracking-wider">Penyebaran Syahbandar</h4>
                  <p className="text-[10px] text-slate-500">Penugasan Pejabat Syahbandar di wilayah binaan</p>
                </div>
              </div>

              <div className="flex flex-col gap-3 flex-1 justify-start">
                {infoData.syahbandarDistribution.map((officer, idx) => (
                  <div key={officer.id || idx} className="p-3 rounded-xl border border-sky-100/60 bg-sky-50/10 flex flex-col gap-1.5 hover:border-sky-200 hover:bg-sky-50/30 transition-all">
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                      <span className="font-bold text-xs text-slate-850 leading-none">{officer.name}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 pl-5.5">
                      {officer.ports.map((p, idx2) => (
                        <span key={idx2} className="px-1.5 py-0.5 rounded bg-sky-50 border border-sky-100 text-[9px] font-bold text-sky-700">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {(!infoData.syahbandarDistribution || infoData.syahbandarDistribution.length === 0) && (
                  <p className="text-center text-slate-400 text-xs py-4">Belum ada data penugasan syahbandar</p>
                )}
              </div>
            </div>

            {/* Box 6: Jumlah Kapal */}
            <div className="relative group bg-white border border-sky-100 rounded-2xl shadow-md p-5 flex flex-col h-full min-h-[300px]">
              {isEditMode && (
                <button
                  onClick={() => openEditSection('vessel_counts')}
                  className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 text-[10px] font-bold z-10 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Ubah</span>
                </button>
              )}

              <div className="flex items-center gap-2 border-b border-sky-50 pb-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Ship className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-slate-850 tracking-wider">Jumlah Kapal Binaan</h4>
                  <p className="text-[10px] text-slate-500">Total armada terdaftar aktif per pelabuhan</p>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 flex-1 justify-center">
                {(() => {
                  const totalVesselsInfo = infoData.binaanVesselCounts.reduce((acc, c) => acc + c.count, 0);
                  const maxCount = Math.max(...infoData.binaanVesselCounts.map(item => item.count), 1);

                  return (
                    <>
                      {[...infoData.binaanVesselCounts].sort((a, b) => b.count - a.count).map((item, idx) => {
                        const pct = totalVesselsInfo > 0 ? Math.round((item.count / totalVesselsInfo) * 100) : 0;
                        const colors = ['bg-sky-600', 'bg-cyan-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-amber-500', 'bg-slate-400'];
                        const colorClass = colors[idx % colors.length];

                        return (
                          <div key={item.id || idx} className="flex flex-col gap-1 text-[11px]">
                            <div className="flex justify-between items-center text-[11px]">
                              <span className="font-bold text-slate-700">{item.name}</span>
                              <span className="font-mono text-slate-600 font-bold">{item.count} Kapal ({pct}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/40">
                              <div 
                                className={`h-full rounded-full ${colorClass} transition-all duration-1000`}
                                style={{ width: `${(item.count / maxCount) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}

                      <div className="border-t border-sky-100 pt-3 mt-1 text-center bg-sky-50/50 p-2.5 rounded-xl border border-sky-100">
                        <span className="text-[10px] uppercase font-bold text-sky-950 tracking-wider block">Total Armada Kapal</span>
                        <strong className="text-2xl font-display font-black text-sky-900 font-mono block mt-0.5">
                          {totalVesselsInfo.toLocaleString('id-ID')} UNIT
                        </strong>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Box 7: Capaian PNBP SDA & Penurunan PNBP */}
          <div className="relative group bg-white border border-sky-100 rounded-2xl shadow-md p-5 flex flex-col gap-4">
            <div className="absolute top-3 right-3 flex flex-col gap-1 z-10">
              {isEditMode && (
                <button
                  onClick={() => openEditSection('pnbp_sda')}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded-md shadow-xs transition-all flex items-center gap-1 text-[9px] font-bold cursor-pointer"
                >
                  <Pencil className="w-2.5 h-2.5" />
                  <span>Data PNBP SDA</span>
                </button>
              )}
            </div>

            {/* Capaian PNBP SDA Table */}
            <div>
              <div className="flex items-center gap-2 border-b border-sky-50 pb-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-slate-850 tracking-wider">Capaian PNBP SDA</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Realisasi penerimaan PNBP SDA per Pelabuhan PIT</p>
                </div>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs bg-slate-50/10 w-full mt-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-sky-600 text-white font-bold border-b border-sky-700">
                        <th rowSpan={2} className="py-2.5 px-3 border-r border-sky-500/50 font-black text-center align-middle uppercase tracking-wider text-[9px] w-1/3">
                          Pelabuhan PIT
                        </th>
                        <th colSpan={4} className="py-1 px-3 border-b border-sky-500/50 font-black text-center uppercase tracking-wider text-[9px]">
                          Tahun
                        </th>
                      </tr>
                      <tr className="bg-sky-500 text-white font-bold border-b border-sky-600">
                        <th colSpan={2} className="py-1 px-3 border-r border-sky-400 font-bold text-center text-[9px] uppercase tracking-wider">
                          2025
                        </th>
                        <th colSpan={2} className="py-1 px-3 font-bold text-center text-[9px] uppercase tracking-wider">
                          2026
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {infoData.pnbpSdaAchievements?.map((item, idx) => (
                        <tr key={item.id || idx} className="border-b border-slate-100 hover:bg-sky-50/20 transition-colors">
                          <td className="py-2.5 px-3 border-r border-slate-100 font-bold text-slate-850">
                            {item.portName}
                          </td>
                          {item.amount2025 > 0 ? (
                            <>
                              <td className="py-2.5 pl-3 pr-1 text-left text-slate-400 font-semibold w-8">
                                Rp
                              </td>
                              <td className="py-2.5 pl-1 pr-3 border-r border-slate-100 text-right font-mono font-bold text-slate-800">
                                {item.amount2025.toLocaleString('id-ID')}
                              </td>
                            </>
                          ) : (
                            <td colSpan={2} className="py-2.5 px-3 border-r border-slate-100 text-center text-slate-400 font-mono font-medium bg-slate-50/10">
                              -
                            </td>
                          )}
                          {item.amount2026 > 0 ? (
                            <>
                              <td className="py-2.5 pl-3 pr-1 text-left text-slate-400 font-semibold w-8">
                                Rp
                              </td>
                              <td className="py-2.5 pl-1 pr-3 text-right font-mono font-bold text-slate-800">
                                {item.amount2026.toLocaleString('id-ID')}
                              </td>
                            </>
                          ) : (
                            <td colSpan={2} className="py-2.5 px-3 text-center text-slate-400 font-mono font-medium bg-slate-50/10">
                              -
                            </td>
                          )}
                        </tr>
                      ))}
                      {(!infoData.pnbpSdaAchievements || infoData.pnbpSdaAchievements.length === 0) && (
                        <tr>
                          <td colSpan={5} className="py-4 text-center text-slate-400 font-medium">Belum ada data capaian PNBP SDA</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Daftar Faktor Penurunan */}
            <div className="border-t border-slate-100 pt-3">
              <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-rose-500" />
                Faktor Penyebab Penurunan PNBP Pasca Produksi:
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {infoData.pnbpDecreaseFactors.map((item, idx) => (
                  <div key={item.id || idx} className="flex gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/40 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-600 font-semibold leading-relaxed">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rincian Alat Tangkap Dominan & Status Perizinan Kapal (Box 10 / Master Data) */}
          <div className="bg-white border border-sky-100 rounded-2xl shadow-md p-5 flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-sky-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-slate-850 tracking-wider">Rincian Alat Tangkap Dominan & Status Perizinan Kapal</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Data terperinci klasifikasi alat tangkap dan sebaran wewenang perizinan pusat vs daerah</p>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 rounded-lg px-2.5 py-1 text-[10px] font-bold text-sky-850 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                <span>Total: {ports.length} Pelabuhan Binaan</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-sky-100 text-sky-800 bg-sky-50/20 font-bold">
                    <th className="py-2.5 px-4 font-bold">NAMA PELABUHAN BINAAN</th>
                    <th className="py-2.5 px-4">ALAT TANGKAP DOMINAN</th>
                    <th className="py-2.5 px-4 text-center">TOTAL ARMADA (UNIT)</th>
                    <th className="py-2.5 px-4 text-center">IZIN PROVINSI (DAERAH)</th>
                    <th className="py-2.5 px-4 text-center">IZIN KKP (PUSAT)</th>
                  </tr>
                </thead>
                <tbody>
                  {ports.map((port) => (
                    <tr key={port.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <button
                          onClick={() => onPortClick?.(port.id)}
                          className="text-left font-black text-sky-600 hover:text-sky-800 hover:underline focus:outline-hidden focus:underline transition-colors cursor-pointer"
                        >
                          {port.name.replace('Pelabuhan Perikanan ', 'PP ').replace('Pangkalan Pendaratan Ikan ', 'PPI ')}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-semibold">{port.dominantFishingGear}</td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">{port.activeVessels}</td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">{port.permitType?.daerah ?? port.activeVessels}</td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">{port.permitType?.pusat ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekap SKKP Detailed Table (Box 11) */}
          <div className="relative group bg-white border border-sky-100 rounded-2xl shadow-md p-5 flex flex-col gap-4 animate-fadeIn">
            {isEditMode && (
              <button
                onClick={() => openEditSection('skkp_recap')}
                className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 text-[10px] font-bold z-10 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Ubah</span>
              </button>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-sky-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-slate-850 tracking-wider">Rekap Penerbitan SKKP Skema Reguler</h4>
                  <p className="text-[10px] text-slate-500 font-medium">Distribusi penerbitan Surat Keterangan Keterampilan Pelaut (SKKP) per wilayah kerja Banten & Lampung</p>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1 text-[10px] font-bold text-indigo-850 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span>Tahun 2025 & 2026</span>
              </div>
            </div>

            {/* Tabel Petugas SKKP */}
            <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs bg-slate-50/10 max-w-xl self-start w-full">
              <div className="bg-slate-100/50 border-b border-slate-150 px-3 py-1.5 flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Petugas SKKP</span>
                <span className="text-[9px] font-bold text-slate-500">Daftar Penugasan</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-indigo-600 text-white font-bold border-b border-indigo-700">
                      <th className="py-2 px-3 border-r border-indigo-500/50 uppercase tracking-wider text-[9px] w-1/2 font-black">Nama Petugas</th>
                      <th className="py-2 px-3 uppercase tracking-wider text-[9px] w-1/2 font-black">Penempatan / Posisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(infoData.skkpOfficers || []).map((officer, idx) => (
                      <tr key={officer.id || idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="py-1.5 px-3 border-r border-slate-100 font-semibold text-slate-700">{officer.name}</td>
                        <td className="py-1.5 px-3 font-medium text-slate-600">{officer.position}</td>
                      </tr>
                    ))}
                    {(!infoData.skkpOfficers || infoData.skkpOfficers.length === 0) && (
                      <tr>
                        <td colSpan={2} className="py-4 text-center text-slate-400 font-medium">Belum ada data petugas SKKP</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {(infoData.skkpRecap || []).map((yearData) => {
                const bantenLocs = yearData.locations.filter(l => l.region === 'Banten');
                const lampungLocs = yearData.locations.filter(l => l.region === 'Lampung');

                const bantenQ1 = bantenLocs.reduce((sum, l) => sum + l.q1, 0);
                const bantenQ2 = bantenLocs.reduce((sum, l) => sum + l.q2, 0);
                const bantenQ3 = bantenLocs.reduce((sum, l) => sum + l.q3, 0);
                const bantenQ4 = bantenLocs.reduce((sum, l) => sum + l.q4, 0);
                const bantenTotal = bantenQ1 + bantenQ2 + bantenQ3 + bantenQ4;

                const lampungQ1 = lampungLocs.reduce((sum, l) => sum + l.q1, 0);
                const lampungQ2 = lampungLocs.reduce((sum, l) => sum + l.q2, 0);
                const lampungQ3 = lampungLocs.reduce((sum, l) => sum + l.q3, 0);
                const lampungQ4 = lampungLocs.reduce((sum, l) => sum + l.q4, 0);
                const lampungTotal = lampungQ1 + lampungQ2 + lampungQ3 + lampungQ4;

                const overallQ1 = bantenQ1 + lampungQ1;
                const overallQ2 = bantenQ2 + lampungQ2;
                const overallQ3 = bantenQ3 + lampungQ3;
                const overallQ4 = bantenQ4 + lampungQ4;
                const overallTotal = bantenTotal + lampungTotal;

                return (
                  <div key={yearData.year} className="bg-slate-50/30 border border-slate-100 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider">Tahun {yearData.year}</span>
                      <span className="text-[10px] font-bold text-slate-500">Skema Reguler</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-700 bg-slate-100/50 font-bold text-[10px]">
                            <th className="py-1.5 px-2 font-bold">LOKASI</th>
                            <th className="py-1.5 px-1 text-center font-bold">I</th>
                            <th className="py-1.5 px-1 text-center font-bold">II</th>
                            <th className="py-1.5 px-1 text-center font-bold">III</th>
                            <th className="py-1.5 px-1 text-center font-bold">IV</th>
                            <th className="py-1.5 px-2 text-center font-black">JUMLAH</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Banten Region */}
                          <tr className="bg-sky-50/20 font-bold text-[10px] text-sky-800">
                            <td colSpan={6} className="py-1 px-2 uppercase tracking-wider">A. WILAYAH BANTEN</td>
                          </tr>
                          {bantenLocs.map((loc, idx) => {
                            const rowTotal = loc.q1 + loc.q2 + loc.q3 + loc.q4;
                            return (
                              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="py-1.5 px-2 font-medium text-slate-700">{loc.name}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q1}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q2}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q3}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q4}</td>
                                <td className="py-1.5 px-2 text-center font-mono font-bold text-sky-850 bg-sky-50/10">{rowTotal}</td>
                              </tr>
                            );
                          })}
                          <tr className="border-b border-sky-100 bg-sky-50/50 font-bold text-sky-900">
                            <td className="py-1.5 px-2 font-black uppercase">TOTAL BANTEN</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{bantenQ1}</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{bantenQ2}</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{bantenQ3}</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{bantenQ4}</td>
                            <td className="py-1.5 px-2 text-center font-mono font-black bg-sky-100/30">{bantenTotal}</td>
                          </tr>

                          {/* Lampung Region */}
                          <tr className="bg-teal-50/20 font-bold text-[10px] text-teal-850 mt-2">
                            <td colSpan={6} className="py-1 px-2 uppercase tracking-wider">B. WILAYAH LAMPUNG</td>
                          </tr>
                          {lampungLocs.map((loc, idx) => {
                            const rowTotal = loc.q1 + loc.q2 + loc.q3 + loc.q4;
                            return (
                              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="py-1.5 px-2 font-medium text-slate-700">{loc.name}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q1}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q2}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q3}</td>
                                <td className="py-1.5 px-1 text-center font-mono text-slate-600">{loc.q4}</td>
                                <td className="py-1.5 px-2 text-center font-mono font-bold text-teal-900 bg-teal-50/10">{rowTotal}</td>
                              </tr>
                            );
                          })}
                          <tr className="border-b border-teal-100 bg-teal-50/40 font-bold text-teal-950">
                            <td className="py-1.5 px-2 font-black uppercase">TOTAL LAMPUNG</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{lampungQ1}</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{lampungQ2}</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{lampungQ3}</td>
                            <td className="py-1.5 px-1 text-center font-mono font-black">{lampungQ4}</td>
                            <td className="py-1.5 px-2 text-center font-mono font-black bg-teal-100/30">{lampungTotal}</td>
                          </tr>

                          {/* Grand Total */}
                          <tr className="bg-slate-900 text-white font-black">
                            <td className="py-2 px-2 uppercase font-black tracking-wider text-[10px]">TOTAL KESELURUHAN</td>
                            <td className="py-2 px-1 text-center font-mono font-black">{overallQ1}</td>
                            <td className="py-2 px-1 text-center font-mono font-black">{overallQ2}</td>
                            <td className="py-2 px-1 text-center font-mono font-black">{overallQ3}</td>
                            <td className="py-2 px-1 text-center font-mono font-black">{overallQ4}</td>
                            <td className="py-2 px-2 text-center font-mono font-black bg-slate-800 text-amber-300">{overallTotal}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SHTI Document Table (Box 8) */}
          <div className="relative group bg-white border border-sky-100 rounded-2xl shadow-md p-5 flex flex-col gap-4">
            {isEditMode && (
              <button
                onClick={() => openEditSection('shti')}
                className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 text-[10px] font-bold z-10 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Ubah</span>
              </button>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-sky-50 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-slate-850 tracking-wider">Permohonan SHTI</h4>
                  <p className="text-[10px] text-slate-500">Sertifikat Hasil Tangkapan Ikan (LA, LT, LTS, COA)</p>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-lg px-2.5 py-1 text-[10px] font-bold text-orange-850 flex flex-wrap gap-2">
                <span>Total SHTI:</span>
                {infoData.shtiApplications.map((item, idx) => {
                  const rowSum = item.la + item.lt + item.lts + item.coa;
                  return (
                    <span key={item.id || idx} className="font-mono">
                      {item.year} ({rowSum.toLocaleString('id-ID')}){idx < infoData.shtiApplications.length - 1 ? ' &' : ''}
                    </span>
                  );
                })}
                <span>Dokumen</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-orange-100 text-orange-800 bg-orange-50/20 font-bold">
                    <th className="py-2.5 px-4 font-black">TAHUN / PERIODE</th>
                    <th className="py-2.5 px-4 text-center">LA (DOKUMEN)</th>
                    <th className="py-2.5 px-4 text-center">LT (DOKUMEN)</th>
                    <th className="py-2.5 px-4 text-center">LTS (DOKUMEN)</th>
                    <th className="py-2.5 px-4 text-center">COA (DOKUMEN)</th>
                    <th className="py-2.5 px-4 text-center font-black">TOTAL DOKUMEN</th>
                  </tr>
                </thead>
                <tbody>
                  {infoData.shtiApplications.map((item, idx) => {
                    const rowSum = item.la + item.lt + item.lts + item.coa;
                    return (
                      <tr key={item.id || idx} className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-800">{item.year}</td>
                        <td className="py-3 px-4 text-center font-mono font-medium">{item.la}</td>
                        <td className="py-3 px-4 text-center font-mono font-medium">{item.lt}</td>
                        <td className="py-3 px-4 text-center font-mono font-medium">{item.lts}</td>
                        <td className="py-3 px-4 text-center font-mono font-medium">{item.coa}</td>
                        <td className="py-3 px-4 text-center font-mono font-black text-orange-850 bg-orange-50/15">{rowSum.toLocaleString('id-ID')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-50 p-2.5 rounded-xl text-center">
              <div>LA = Lembar Awal</div>
              <div>LT = Lembar turunan</div>
              <div>LTS = Lembar turunan Sementara</div>
              <div>COA = Certificate of Admissibility</div>
            </div>
          </div>

          {/* Visi & Tujuan Box (Box 9) */}
          <div className="relative group bg-sky-950 text-sky-100 rounded-2xl p-5 border border-sky-900 flex flex-col md:flex-row items-start md:items-center gap-4 shadow-md">
            {isEditMode && (
              <button
                onClick={() => openEditSection('goals')}
                className="absolute top-3 right-3 bg-amber-500 hover:bg-amber-600 text-white p-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1 text-[10px] font-bold z-10 cursor-pointer"
              >
                <Pencil className="w-3 h-3" />
                <span>Ubah</span>
              </button>
            )}

            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-sky-400 tracking-widest block font-display">9. TUJUAN UTAMA INFOGRAFIS</span>
              <p className="text-xs md:text-sm text-sky-200 mt-1 font-medium leading-relaxed">
                {infoData.goals}
              </p>
            </div>
          </div>

          {/* INFOGRAPHIC EDIT MODAL */}
          <InfographicModal
            editingSection={editingSection}
            infoData={infoData}
            onClose={() => setEditingSection(null)}
            onSave={handleSaveSection}
          />

        </div>
    </div>
  );
}
