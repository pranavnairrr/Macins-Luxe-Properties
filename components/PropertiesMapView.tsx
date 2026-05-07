'use client';

import { useEffect, useRef } from 'react';
import type { ListingRecord } from '@/components/staff/PropertyListingForm';

interface Props {
  listings: ListingRecord[];
}

function markerHTML(p: ListingRecord) {
  const image = p.images?.[0] ?? '/images/hero/img227.jpg';
  return `
    <div class="mlx-root">
      <div class="mlx-card">
        <div class="mlx-hero">
          <img src="${image}" alt="${p.name}" />
        </div>
        <div class="mlx-details">
          <div class="mlx-name">${p.name}</div>
          <div class="mlx-loc">${p.location}&nbsp;·&nbsp;${p.beds}</div>
          <a href="/properties/${p.id}" class="mlx-btn">View Details</a>
        </div>
        <div class="mlx-row">
          <div class="mlx-thumb"><img src="${image}" alt="${p.name}" /></div>
          <span class="mlx-price">${p.price}</span>
        </div>
      </div>
      <div class="mlx-tip"></div>
    </div>
  `;
}

export default function PropertiesMapView({ listings }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mappable = listings.filter(l => l.latitude != null && l.longitude != null);

    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mapInstance: any = null;

    (async () => {
      const L = (await import('leaflet')).default;
      if (!isMounted || !container.isConnected) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((container as any)._leaflet_id != null) return;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      mapInstance = L.map(container, {
        center: [25.11, 55.22],
        zoom: 11,
        scrollWheelZoom: true,
        dragging: true,
        zoomControl: true,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        },
      ).addTo(mapInstance);

      mappable.forEach(p => {
        const icon = L.divIcon({
          className: 'mlx-icon',
          html: markerHTML(p),
          iconSize:   [168, 56],
          iconAnchor: [84,  56],
        });
        L.marker([p.latitude!, p.longitude!], { icon }).addTo(mapInstance);
      });

      // If no mappable listings, just show Dubai center
    })();

    return () => {
      isMounted = false;
      if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings.length]);

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      <style jsx global>{`
        .mlx-icon { overflow: visible !important; background: transparent !important; border: none !important; pointer-events: none !important; }
        .mlx-root { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; cursor: pointer; pointer-events: all; }
        .mlx-card { display: flex; flex-direction: column-reverse; background: #fff; border-radius: 10px; box-shadow: 0 4px 16px rgba(0,0,0,0.50); overflow: hidden; width: 168px; transition: box-shadow 0.3s ease; }
        .mlx-row { display: flex; align-items: center; gap: 8px; padding: 7px 10px; flex-shrink: 0; }
        .mlx-thumb { width: 34px; height: 34px; border-radius: 6px; overflow: hidden; flex-shrink: 0; border: 1.5px solid rgba(26,37,53,0.12); }
        .mlx-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mlx-price { font-family: Poppins, sans-serif; font-size: 12px; font-weight: 700; color: #1A2535; white-space: nowrap; }
        .mlx-hero { overflow: hidden; max-height: 0; transition: max-height 0.40s cubic-bezier(0.4,0,0.2,1); }
        .mlx-hero img { width: 100%; height: 112px; object-fit: cover; display: block; }
        .mlx-details { overflow: hidden; max-height: 0; padding: 0 10px; transition: max-height 0.35s cubic-bezier(0.4,0,0.2,1) 0.04s; }
        .mlx-name { font-family: Poppins, sans-serif; font-size: 11px; font-weight: 600; color: #222; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mlx-loc { font-family: Poppins, sans-serif; font-size: 10px; color: #888; margin-bottom: 8px; white-space: nowrap; }
        .mlx-btn { display: block; text-align: center; padding: 6px 0; margin-bottom: 10px; background: #1A2535; color: #fff; border-radius: 5px; font-family: Poppins, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.05em; text-decoration: none; }
        .mlx-tip { width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 9px solid #fff; filter: drop-shadow(0 3px 4px rgba(0,0,0,0.35)); flex-shrink: 0; }
        .mlx-root:hover .mlx-card { box-shadow: 0 12px 36px rgba(0,0,0,0.55); }
        .mlx-root:hover .mlx-hero { max-height: 120px; }
        .mlx-root:hover .mlx-details { max-height: 92px; }
        .leaflet-control-attribution { font-size: 9px !important; opacity: 0.45 !important; background: rgba(0,0,0,0.50) !important; color: #ccc !important; }
        .leaflet-control-attribution a { color: #999 !important; }
      `}</style>
    </>
  );
}
