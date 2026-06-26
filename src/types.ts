export type PortClass = 'PPS' | 'PPN' | 'PPP' | 'PPI';
export type Region = 'Banten' | 'Lampung';

export interface SyahbandarStaff {
  position: string;
  name: string;
  stay?: string;
}

export interface Port {
  id: string;
  name: string;
  region: Region;
  district: string;
  latitude: number;
  longitude: number;
  class: PortClass;
  dominantFishingGear: string; // Dominant fishing gear type
  activeVessels: number;
  commodities: string[];
  facilities: string[];
  description: string;
  syahbandarStaff?: SyahbandarStaff[]; // List of Syahbandar and other officers
  vesselBreakdown: {
    small: number; // < 5 GT
    medium: number; // 5 - 30 GT
    large: number; // > 30 GT
  };
  permitType?: {
    daerah: number;
    pusat: number;
  };
  gearsBreakdown?: {
    name: string;
    count: number;
  }[];
  problems?: string[];
}

export interface Statistics {
  totalPorts: number;
  totalVessels: number;
  bantenCount: number;
  lampungCount: number;
  classDistribution: Record<PortClass, number>;
}
