import { Port } from '../types';

export const defaultPorts: Port[] = [
  {
    id: 'port-banten-1',
    name: 'Pelabuhan Perikanan Nusantara (PPN) Karangantu',
    region: 'Banten',
    district: 'Kota Serang',
    latitude: -6.028570022365496,
    longitude: 106.16417040102813,
    class: 'PPN',
    dominantFishingGear: 'Arad',
    activeVessels: 361,
    commodities: ['Kembung', 'Selar', 'Tongkol', 'Layang', 'Teri'],
    facilities: ['Cold Storage', 'Tempat Pelelangan Ikan (TPI)', 'Dermaga Sandar', 'Pabrik Es', 'SPBUN', 'Bengkel Kapal'],
    description: 'PPN Karangantu merupakan salah satu pelabuhan perikanan tertua dan strategis di pesisir utara Banten, melayani armada perikanan Selat Sunda dan Laut Jawa. Berfungsi sebagai pusat logistik perikanan utama untuk Serang dan sekitarnya.',
    syahbandarStaff: [
      { position: 'Kepala Pelabuhan / Syahbandar', name: 'Ir. H. Mulyadi', stay: 'Karangantu' }
    ],
    vesselBreakdown: {
      small: 280,
      medium: 70,
      large: 11
    },
    permitType: {
      daerah: 361,
      pusat: 0
    },
    gearsBreakdown: [
      { name: 'Arad', count: 106 },
      { name: 'Rajungan', count: 63 },
      { name: 'Jr. Rajungan', count: 46 },
      { name: 'Rampus', count: 33 },
      { name: 'Pancing', count: 27 },
      { name: 'Jr. Rampus', count: 21 },
      { name: 'Bagan Perahu', count: 20 },
      { name: 'Bagan Tancap', count: 14 },
      { name: 'Bondet/Jr. Payang', count: 12 },
      { name: 'Bubu', count: 4 },
      { name: 'Pancing ulur', count: 4 },
      { name: 'Budidaya Kerang Hijau/Jr.Rajungan', count: 3 },
      { name: 'Sero', count: 3 },
      { name: 'pengangkut', count: 2 },
      { name: 'Bubu (Udang)', count: 1 },
      { name: 'Gill net', count: 1 },
      { name: 'Kerang', count: 1 }
    ]
  },
  {
    id: 'port-banten-2',
    name: 'Pelabuhan Perikanan Pantai (PPP) Labuan',
    region: 'Banten',
    district: 'Pandeglang',
    latitude: -6.373835523033538,
    longitude: 105.8239857550097,
    class: 'PPP',
    dominantFishingGear: 'Pancing',
    activeVessels: 0,
    commodities: ['Tuna', 'Cakalang', 'Tongkol', 'Tenggiri', 'Kakap Merah'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Dermaga Sandar', 'Pabrik Es', 'Kios Nelayan', 'Suplai Air Bersih'],
    description: 'Terletak di pantai barat Banten menghadap Selat Sunda. Menjadi pusat pendaratan ikan pelagis besar berkualitas tinggi serta menopang perekonomian nelayan tradisional di Kabupaten Pandeglang.',
    syahbandarStaff: [
      { position: 'Kepala Pelabuhan / Syahbandar', name: 'Drs. Ahmad Sobari', stay: 'Labuan' }
    ],
    vesselBreakdown: {
      small: 0,
      medium: 0,
      large: 0
    },
    permitType: {
      daerah: 0,
      pusat: 0
    },
    gearsBreakdown: []
  },
  {
    id: 'port-banten-4',
    name: 'Pangkalan Pendaratan Ikan (PPI) Kronjo',
    region: 'Banten',
    district: 'Tangerang',
    latitude: -6.0546001200704955,
    longitude: 106.42779524013598,
    class: 'PPI',
    dominantFishingGear: 'Jaring Tarik Berkantong',
    activeVessels: 20,
    commodities: ['Kerang', 'Udang Peci', 'Kepiting', 'Banyar', 'Belanak'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Tambat Labuh', 'Pasar Ikan Basah', 'Kedai Pesisir'],
    description: 'Pusat pendaratan ikan pesisir utara Tangerang yang menyuplai kebutuhan seafood segar untuk pasar Jabodetabek. Didominasi oleh tangkapan komoditas benthos and estuari.',
    syahbandarStaff: [
      { position: 'Syahbandar / Pengelola PPI Kronjo', name: 'H. Sanusi', stay: 'Kronjo' }
    ],
    vesselBreakdown: {
      small: 15,
      medium: 5,
      large: 0
    },
    permitType: {
      daerah: 20,
      pusat: 0
    },
    gearsBreakdown: [
      { name: 'Jaring Tarik Berkantong', count: 20 }
    ]
  },
  {
    id: 'port-banten-panimbang',
    name: 'Pelabuhan Perikanan Panimbang',
    region: 'Banten',
    district: 'Pandeglang',
    latitude: -6.491562028600561,
    longitude: 105.79703870344201,
    class: 'PPI',
    dominantFishingGear: 'Jaring Tarik Berkantong',
    activeVessels: 63,
    commodities: ['Tuna', 'Tongkol', 'Layang', 'Layur', 'Udang', 'Kembung'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Dermaga Sandar', 'Pabrik Es', 'SPBUN', 'Tambat Labuh'],
    description: 'Pelabuhan Perikanan Panimbang berlokasi di Teluk Lada, Kecamatan Panimbang, Kabupaten Pandeglang. Pelabuhan ini merupakan salah satu sentra pendaratan ikan yang sangat strategis di pesisir barat Banten untuk mendukung perikanan tangkap di perairan Selat Sunda.',
    syahbandarStaff: [
      { position: 'Kepala Pelabuhan / Syahbandar', name: 'H. M. Yusuf, S.Pi', stay: 'Panimbang' }
    ],
    vesselBreakdown: {
      small: 45,
      medium: 15,
      large: 3
    },
    permitType: {
      daerah: 63,
      pusat: 0
    },
    gearsBreakdown: [
      { name: 'Jaring Tarik Berkantong', count: 41 },
      { name: 'Lainnya', count: 9 },
      { name: 'pengangkut', count: 6 },
      { name: 'Jaring insang hanyut', count: 5 },
      { name: 'Pukat cincin pelagis besar', count: 1 },
      { name: 'Pukat cincin pelagis kecil', count: 1 }
    ]
  },
  {
    id: 'port-banten-cituis',
    name: 'Pangkalan Pendaratan Ikan (PPI) Cituis',
    region: 'Banten',
    district: 'Tangerang',
    latitude: -6.032723572621554,
    longitude: 106.5775991813726,
    class: 'PPI',
    dominantFishingGear: 'Jaring Tarik Berkantong',
    activeVessels: 7,
    commodities: ['Kembung', 'Cumi-cumi', 'Bawal Hitam', 'Selar', 'Teri'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Dermaga Sandar', 'Suplai Air Bersih', 'Tambat Labuh'],
    description: 'PPI Cituis berlokasi di Kecamatan Suryabahari, Kabupaten Tangerang, Banten. Berfungsi sebagai salah satu sentra pendaratan ikan andalan masyarakat Tangerang Utara.',
    syahbandarStaff: [
      { position: 'Syahbandar / Pengelola PPI Cituis', name: 'H. Akhmad Fauzi', stay: 'Cituis' }
    ],
    vesselBreakdown: {
      small: 5,
      medium: 2,
      large: 0
    },
    permitType: {
      daerah: 7,
      pusat: 0
    },
    gearsBreakdown: [
      { name: 'Jaring Tarik Berkantong', count: 7 }
    ]
  },
  {
    id: 'port-lampung-muarapiluk',
    name: 'Pangkalan Pendaratan Ikan (PPI) Muara Piluk',
    region: 'Lampung',
    district: 'Lampung Selatan',
    latitude: -5.8594383562983525,
    longitude: 105.76041734651648,
    class: 'PPI',
    dominantFishingGear: 'Bouke Ami',
    activeVessels: 5,
    commodities: ['Tongkol', 'Layang', 'Kembung', 'Cumi-cumi', 'Teri'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Dermaga Kayu', 'Tambatan Perahu', 'Kios Nelayan'],
    description: 'PPI Muara Piluk terletak di kawasan Bakauheni, Kabupaten Lampung Selatan. Pelabuhan pendaratan ini melayani armada perikanan pantai di ujung selatan Pulau Sumatera.',
    syahbandarStaff: [
      { position: 'Syahbandar', name: 'Zainal. K. S. Pi, M.Ling', stay: 'Syahbandar Prov. Lampung' }
    ],
    vesselBreakdown: {
      small: 5,
      medium: 0,
      large: 0
    },
    permitType: {
      daerah: 0,
      pusat: 5
    },
    gearsBreakdown: [
      { name: 'Bouke Ami', count: 5 }
    ],
    problems: [
      'Aktivitas pendaratan kapal dominan dilakukan di PP Eretan Wetan Indramayu.',
      'Didominasi kapal bagan berperahu teri yang beroperasi di bawah 12 Mil.',
      'Sebagian kapal bagan berperahu teri belum memiliki izin resmi.',
      'Kekhawatiran nelayan terdeteksi melakukan pelanggaran zona penangkapan.',
      'Tindakan oknum APH di laut yang mencari-cari kesalahan nelayan sehingga menghambat operasi penangkapan ikan.'
    ]
  },
  {
    id: 'port-lampung-lempasing',
    name: 'Pelabuhan Perikanan Pantai (PPP) Lempasing',
    region: 'Lampung',
    district: 'Bandar Lampung',
    latitude: -5.4860890366837625,
    longitude: 105.2507330140776,
    class: 'PPP',
    dominantFishingGear: 'Bagan Berperahu / Bagan Apung',
    activeVessels: 128,
    commodities: ['Tuna', 'Cakalang', 'Tongkol', 'Kembung', 'Cumi-cumi'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Cold Storage', 'Dermaga Sandar', 'Pabrik Es', 'SPBUN', 'Gudang Beku'],
    description: 'PPP Lempasing merupakan pelabuhan perikanan pantai terbesar di kawasan Teluk Lampung, Bandar Lampung. Menjadi hub perikanan tangkap yang sangat aktif dengan jangkauan operasional hingga Selat Sunda dan Samudera Hindia.',
    syahbandarStaff: [
      { position: 'Kepala Pelabuhan / Syahbandar', name: 'Suharto, S.Pi', stay: 'Lempasing' }
    ],
    vesselBreakdown: {
      small: 80,
      medium: 40,
      large: 8
    },
    permitType: {
      daerah: 128,
      pusat: 0
    },
    gearsBreakdown: [
      { name: 'Bagan berperahu atau bagan apung', count: 77 },
      { name: 'pengangkut', count: 23 },
      { name: 'Jaring Tarik Berkantong', count: 13 },
      { name: 'PCPK SK', count: 7 },
      { name: 'Pancing berjoran', count: 3 },
      { name: 'Jaring insang tetap', count: 2 },
      { name: 'Bagan berperahu teri atau bagan apung teri', count: 1 },
      { name: 'Bagan Tancap', count: 1 },
      { name: 'Gillnet', count: 1 }
    ]
  },
  {
    id: 'port-lampung-maringgai',
    name: 'Pelabuhan Perikanan Labuhan Maringgai',
    region: 'Lampung',
    district: 'Labuhan Maringgai',
    latitude: -5.358835261381568,
    longitude: 105.82054158492757,
    class: 'PPI',
    dominantFishingGear: 'Jaring Insang Hanyut',
    activeVessels: 0,
    commodities: ['Rajungan', 'Udang Windu', 'Bawal Putih', 'Manyung', 'Kakap'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Dermaga Sandar', 'Pabrik Es', 'SPBUN'],
    description: 'Pelabuhan Perikanan Labuhan Maringgai merupakan salah satu pelabuhan perikanan tersibuk di pesisir Lampung Timur, melayani armada perikanan Selat Sunda dan Selat Bangka. Berfungsi sebagai penopang produksi rajungan dan udang tangkap utama.',
    syahbandarStaff: [
      { position: 'Syahbandar / Kepala Pelabuhan', name: 'Dwi Prasetyo, M.Si', stay: 'Labuhan Maringgai' }
    ],
    vesselBreakdown: {
      small: 0,
      medium: 0,
      large: 0
    },
    permitType: {
      daerah: 0,
      pusat: 0
    },
    gearsBreakdown: []
  },
  {
    id: 'port-lampung-kualapenet',
    name: 'Pelabuhan Perikanan Kuala Penet',
    region: 'Lampung',
    district: 'Braja Selebah',
    latitude: -5.25500495875772,
    longitude: 105.86384745293658,
    class: 'PPI',
    dominantFishingGear: 'Jaring Hela Ikan Berkantong',
    activeVessels: 79,
    commodities: ['Gulamah', 'Kurisi', 'Kepiting', 'Layur', 'Udang Jerbung'],
    facilities: ['Tempat Pelelangan Ikan (TPI)', 'Dermaga Sandar', 'Tambat Labuh'],
    description: 'Terletak di muara Sungai Penet yang strategis di Kabupaten Lampung Timur. Berfungsi sebagai pendaratan hasil laut yang subur serta pelabuhan singgah bagi para nelayan tradisional.',
    syahbandarStaff: [
      { position: 'Syahbandar', name: 'GELLEN NENDO PERDANA A.Md, S.E.', stay: 'Kuala Penet' },
      { position: 'Verifikator', name: 'Ipan Sukron Nabawi, S.AP', stay: 'Kuala Penet' },
      { position: 'Koordinator harian PNBP SDA', name: 'Siti Yunipa, S.PKP', stay: 'Karangantu' },
      { position: 'Validator', name: 'Rafli Saputera Tahir, A.Md.Pi', stay: 'Karangantu' }
    ],
    vesselBreakdown: {
      small: 50,
      medium: 25,
      large: 4
    },
    permitType: {
      daerah: 0,
      pusat: 79
    },
    gearsBreakdown: [
      { name: 'Jaring Hela Ikan Berkantong', count: 74 },
      { name: 'Jaring insang hanyut', count: 2 },
      { name: 'Bagan Berperahu Teri', count: 2 },
      { name: 'Rawai Dasar', count: 1 }
    ],
    problems: [
      'Kendala harga VMS (Vessel Monitoring System) yang dinilai memberatkan.',
      'Biaya Airtime VMS bulanan yang cukup tinggi bagi nelayan kecil.',
      'Pada musim barat (Desember-Maret), nelayan melakukan penangkapan di WPP 712 (Selat Sunda) sedangkan izin yang diberikan adalah di WPP 711.',
      'Kekhawatiran nelayan akan terdeteksi melakukan pelanggaran zona penangkapan.',
      'Izin penangkapan sudah lengkap, namun di laut seringkali dicari-cari kesalahan oleh oknum Aparat Penegak Hukum (APH) sehingga menghambat operasi.'
    ]
  }
];

export const AVAILABLE_COMMODITIES = [
  'Tuna', 'Cakalang', 'Tongkol', 'Layur', 'Kembung', 'Selar', 
  'Layang', 'Teri', 'Teri Nasi', 'Tenggiri', 'Kakap Merah', 
  'Kakap', 'Kerapu', 'Lobster', 'Gurita', 'Kerang', 'Udang Peci', 
  'Udang Windu', 'Udang Putih', 'Udang Jerbung', 'Kepiting', 
  'Kepiting Bakau', 'Rajungan', 'Bawal Hitam', 'Bawal Putih', 
  'Sembilang', 'Belanak', 'Gulamah', 'Kurisi', 'Cumi-cumi', 'Manyung'
];

export const AVAILABLE_FACILITIES = [
  'Cold Storage', 
  'Tempat Pelelangan Ikan (TPI)', 
  'Dermaga Sandar', 
  'Pabrik Es', 
  'SPBUN', 
  'Bengkel Kapal', 
  'Gudang Beku', 
  'Suplai Air Bersih', 
  'Tambat Labuh', 
  'Gudang Alat Tangkap', 
  'Unit Pengolahan'
];

export const AVAILABLE_GEARS = [
  'Arad',
  'Bagan Berperahu / Bagan Apung',
  'Jaring Tarik Berkantong',
  'Jaring Hela Ikan Berkantong',
  'Jaring Insang Hanyut',
  'Bouke Ami',
  'Pancing',
  'Bagan Tancap',
  'Bondet/Jr. Payang',
  'Bubu',
  'Pancing ulur',
  'Budidaya Kerang Hijau/Jr.Rajungan',
  'Sero',
  'pengangkut',
  'Bubu (Udang)',
  'Gill net',
  'Kerang',
  'Pancing berjoran'
];
