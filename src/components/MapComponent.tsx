import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Port, Region } from '../types';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  ports: Port[];
  selectedPortId: string | null;
  onSelectPort: (id: string) => void;
  onMapClick: (lat: number, lng: number, region: Region) => void;
  isAddingNew: boolean;
  pendingCoords: { latitude: number; longitude: number } | null;
}

export default function MapComponent({
  ports,
  selectedPortId,
  onSelectPort,
  onMapClick,
  isAddingNew,
  pendingCoords,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const pendingMarkerRef = useRef<L.Marker | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Sunda Strait center, displaying both Banten and Lampung
  const centerLat = -5.92;
  const centerLng = 105.95;
  const defaultZoom = 9;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Define bounds for the locked region (Banten and Lampung surrounding Sunda Strait)
    const bounds = L.latLngBounds([[-7.2, 104.5], [-4.8, 107.5]]);

    // Create the map instance with all zoom/drag interactions enabled but restricted to the locked bounds
    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLng],
      zoom: defaultZoom,
      zoomControl: false, // We will add it manually at 'topright' for premium aesthetics
      minZoom: 8,
      maxZoom: 16,
      dragging: true,
      touchZoom: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      maxBounds: bounds,
      maxBoundsViscosity: 1.0,
    });

    // Add zoom control on the top right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add high resolution Google Earth (Satellite / Hybrid) tile layer
    L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      attribution: '&copy; <a href="https://maps.google.com">Google Maps</a>',
      subdomains: '0123',
      maxZoom: 20,
    }).addTo(map);

    mapRef.current = map;
    setMapInitialized(true);

    // Click handler for placing a custom point
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      
      // Determine region based on Longitude
      // Lampung is generally west of 105.95
      // Banten is generally east of 105.95
      const region: Region = lng < 105.95 ? 'Lampung' : 'Banten';
      
      onMapClick(Number(lat.toFixed(6)), Number(lng.toFixed(6)), region);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        setMapInitialized(false);
      }
    };
  }, [onMapClick]);

  // Update Markers when ports list or selected port changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapInitialized) return;

    // Clear existing markers
    const currentMarkers = markersRef.current;
    Object.keys(currentMarkers).forEach((id) => {
      currentMarkers[id].remove();
    });
    markersRef.current = {};

    ports.forEach((port) => {
      // Determine colors and classes
      const isSelected = port.id === selectedPortId;
      const ringClass = isSelected ? 'ring-4 ring-offset-2 ring-indigo-500 scale-110 z-[1000]' : 'hover:scale-105 hover:z-[500]';

      let themeColorClass = '';
      let colorIndicator = '';
      switch (port.class) {
        case 'PPS':
          themeColorClass = 'bg-indigo-600 border-indigo-200';
          colorIndicator = '#4f46e5';
          break;
        case 'PPN':
          themeColorClass = 'bg-sky-600 border-sky-200';
          colorIndicator = '#0284c7';
          break;
        case 'PPP':
          themeColorClass = 'bg-emerald-600 border-emerald-200';
          colorIndicator = '#059669';
          break;
        case 'PPI':
          themeColorClass = 'bg-amber-500 border-amber-200';
          colorIndicator = '#d97706';
          break;
        default:
          themeColorClass = 'bg-slate-600 border-slate-200';
          colorIndicator = '#475569';
      }

      // Create a gorgeous custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-port-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <!-- Pulsing outer circle if selected -->
            ${isSelected ? `<div class="absolute w-12 h-12 bg-indigo-500/25 rounded-full custom-marker-pulse"></div>` : ''}
            
            <!-- Pin Container -->
            <div id="marker-${port.id}" class="w-9 h-9 rounded-xl flex flex-col items-center justify-center text-white font-bold shadow-lg border-2 ${themeColorClass} ${ringClass} transition-all duration-300">
              <span class="text-[9px] tracking-tighter leading-none">${port.class === 'PPI' ? 'PP' : port.class}</span>
              <svg class="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
            </div>
            
            <!-- Tooltip text on hover -->
            <div class="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white/95 border border-sky-100 text-slate-800 text-[10px] font-semibold px-2 py-0.5 rounded-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
              ${port.name}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([port.latitude, port.longitude], { icon: customIcon });
      
      // Click handler
      marker.on('click', (e) => {
        // Prevent map click trigger
        L.DomEvent.stopPropagation(e);
        onSelectPort(port.id);
      });

      // Simple tooltip
      marker.bindTooltip(`
        <div class="p-1.5 font-sans">
          <div class="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
            <span class="w-2 h-2 rounded-full" style="background-color: ${colorIndicator}"></span>
            ${port.name}
          </div>
          <div class="text-[10px] text-slate-500 mt-0.5 flex gap-2">
            <span>Kelas: <strong class="text-slate-700">${port.class === 'PPI' ? 'PP' : port.class}</strong></span>
            <span>Wilayah: <strong class="text-slate-700">${port.region}</strong></span>
          </div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -10],
        opacity: 0.95,
      });

      marker.addTo(map);
      markersRef.current[port.id] = marker;
    });
  }, [ports, selectedPortId, mapInitialized, onSelectPort]);

  // Update Pending Coordinates Marker (visual indicator when user is placing a new point)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapInitialized) return;

    if (pendingMarkerRef.current) {
      pendingMarkerRef.current.remove();
      pendingMarkerRef.current = null;
    }

    if (pendingCoords) {
      const pendingIcon = L.divIcon({
        className: 'pending-port-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-12 h-12 bg-rose-500/30 rounded-full custom-marker-pulse"></div>
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-white bg-rose-500 border-2 border-white shadow-xl animate-bounce">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([pendingCoords.latitude, pendingCoords.longitude], { icon: pendingIcon });
      marker.bindTooltip(`
        <div class="p-1 font-sans font-semibold text-xs text-rose-600">
          Titik Baru Terpilih! Isi formulir untuk menyimpan.
        </div>
      `, { direction: 'top', offset: [0, -10], permanent: true }).addTo(map);

      pendingMarkerRef.current = marker;
      // Map stays locked, no panning to pendingCoords
    }
  }, [pendingCoords, mapInitialized]);

  // Dynamic Fit Bounds - guarantees all ports are fully visible and locked in view
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapInitialized || ports.length === 0) return;

    const latLngs = ports.map((p) => L.latLng(p.latitude, p.longitude));
    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, {
      padding: [45, 45],
      animate: true,
      duration: 0.8,
    });
  }, [ports, mapInitialized]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-sky-100 shadow-md group bg-[#f0f7fc]">
      {/* Map Container */}
      <div id="infographic-map" ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Instructions/Status overlay */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
        {isAddingNew && (
          <div className="bg-rose-500/90 backdrop-blur-md border border-rose-400/30 text-white px-3.5 py-2.5 rounded-xl shadow-lg font-medium text-xs flex items-center gap-2 animate-bounce pointer-events-auto">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Mode Tambah: Klik lokasi mana saja di peta untuk menentukan koordinat pelabuhan baru!</span>
          </div>
        )}
      </div>

      {/* Mini Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-sky-100 shadow-lg text-[10px] text-slate-600 flex flex-wrap gap-x-4 gap-y-1 max-w-[280px] sm:max-w-none">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[8px]">PPS</span>
          <span>Samudera</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[8px]">PPN</span>
          <span>Nusantara</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[8px]">PPP</span>
          <span>Pantai</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[8px]">PP</span>
          <span>Pelabuhan Perikanan</span>
        </div>
      </div>
    </div>
  );
}
