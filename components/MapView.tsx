'use client';

import { useEffect, useRef } from 'react';

const PROPERTIES = [
  {
    name: 'Binghatti Hills',
    price: 'AED 1.10M',
    location: 'Dubai Hills',
    beds: '1, 2, 3 BR',
    lat: 25.1124,
    lng: 55.2394,
    image: '/images/properties/Binghatti-Hills-at-Dubai-HIlls.jpeg',
  },
  {
    name: 'Bugatti Residences',
    price: 'AED 13.47M',
    location: 'Business Bay',
    beds: '3, 4, 5 BR',
    lat: 25.1862,
    lng: 55.2676,
    image: '/images/properties/gulfnews_2025-12-12_kjm4wss9_Bugatti-Residences-by-Binghatti.avif',
  },
  {
    name: 'Binghatti Luxuria',
    price: 'AED 7.25M',
    location: 'JVC',
    beds: '1, 2, 3 BR',
    lat: 25.0572,
    lng: 55.2097,
    image: '/images/properties/binghatti-luxuria-hero-banner.avif',
  },
  {
    name: 'Binghatti Hillside',
    price: 'AED 3.5M',
    location: 'Dubai Science Park',
    beds: '1, 2, 3 BR',
    lat: 25.0926,
    lng: 55.1861,
    image: '/images/properties/Binghatti-Hillside-at-Dubai-Science-Park.webp',
  },
  {
    name: 'Binghatti Flare',
    price: 'AED 585K',
    location: 'JVT',
    beds: '1, 2, Studio',
    lat: 25.0497,
    lng: 55.1908,
    image: '/images/properties/Binghatti-Falre-JVT-Towers.jpg',
  },
  {
    name: 'Binghatti Hillcrest',
    price: 'AED 1.10M',
    location: 'Dubai Hills',
    beds: '1, 2, Studio',
    lat: 25.1052,
    lng: 55.2540,
    image: '/images/properties/binghatti-hillcrest-hero-banner.avif',
  },
];

/*
 * Each marker is a small white card (thumb + price) that expands upward on hover.
 *
 * Key insight for "only top marker interactable" bug:
 *   Leaflet sets the iconSize as a transparent div — all 6 containers overlap.
 *   Fix: set iconSize to just the compact card height (~56px) so the transparent
 *   area is minimal, set pointer-events:none on the container (.mlx-icon),
 *   and re-enable pointer-events:all on .mlx-root (the visible card).
 *   overflow:visible lets the expanded card bleed out of the small container.
 *
 * The card uses flex-direction:column-reverse so the compact row is always at
 * the bottom and expansion grows upward (away from the map).
 */
function markerHTML(p: (typeof PROPERTIES)[number]) {
  return `
    <div class="mlx-root">
      <div class="mlx-card">
        <!-- column-reverse: DOM top→bottom becomes visual bottom→top -->
        <!-- hero image appears at visual top, row stays at visual bottom -->
        <div class="mlx-hero">
          <img src="${p.image}" alt="${p.name}" />
        </div>
        <div class="mlx-details">
          <div class="mlx-name">${p.name}</div>
          <div class="mlx-loc">${p.location}&nbsp;·&nbsp;${p.beds}</div>
          <a href="#" class="mlx-btn" onclick="return false;">Enquire Now</a>
        </div>
        <div class="mlx-row">
          <div class="mlx-thumb"><img src="${p.image}" alt="${p.name}" /></div>
          <span class="mlx-price">${p.price}</span>
        </div>
      </div>
      <div class="mlx-tip"></div>
    </div>
  `;
}

export default function MapView() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

      /* CartoDB Voyager — clean street map, closest to Google Maps default */
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        },
      ).addTo(mapInstance);

      PROPERTIES.forEach(p => {
        const icon = L.divIcon({
          /*
           * className 'mlx-icon' → CSS sets pointer-events:none + overflow:visible
           * on this container so it doesn't block neighbouring markers.
           * The actual card (.mlx-root) re-enables pointer-events:all.
           *
           * iconSize matches only the compact card (~168×56px) so the transparent
           * area is minimal. Expanded content overflows upward via overflow:visible.
           */
          className: 'mlx-icon',
          html: markerHTML(p),
          iconSize:   [168, 56],
          iconAnchor: [84,  56],   // bottom-centre = tip of the pointer
        });

        L.marker([p.lat, p.lng], { icon }).addTo(mapInstance);
      });
    })();

    return () => {
      isMounted = false;
      if (mapInstance) { mapInstance.remove(); mapInstance = null; }
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      <style jsx global>{`
        /* ── Icon container — transparent, non-blocking ── */
        .mlx-icon {
          overflow: visible !important;
          background: transparent !important;
          border: none !important;
          pointer-events: none !important;
        }

        /* ── Marker root — anchored at bottom, grows upward ── */
        .mlx-root {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          pointer-events: all;   /* re-enable on the visible card */
        }

        /* ── Card shell ──
           flex-direction:column-reverse puts .mlx-row at visual bottom
           and .mlx-hero / .mlx-details above it — expanding upward. */
        .mlx-card {
          display: flex;
          flex-direction: column-reverse;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.50);
          overflow: hidden;
          width: 168px;
          transition: box-shadow 0.3s ease;
        }

        /* Always-visible compact row: thumbnail + price */
        .mlx-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          flex-shrink: 0;
        }
        .mlx-thumb {
          width: 34px;
          height: 34px;
          border-radius: 6px;
          overflow: hidden;
          flex-shrink: 0;
          border: 1.5px solid rgba(26,37,53,0.12);
        }
        .mlx-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .mlx-price {
          font-family: Poppins, sans-serif;
          font-size: 12px;
          font-weight: 700;
          color: #1A2535;
          white-space: nowrap;
        }

        /* Hero image — slides in above the row on hover */
        .mlx-hero {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.40s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mlx-hero img { width: 100%; height: 112px; object-fit: cover; display: block; }

        /* Details — slides in between hero and row on hover */
        .mlx-details {
          overflow: hidden;
          max-height: 0;
          padding: 0 10px;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1) 0.04s;
        }
        .mlx-name {
          font-family: Poppins, sans-serif;
          font-size: 11px; font-weight: 600; color: #222;
          margin-bottom: 2px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .mlx-loc {
          font-family: Poppins, sans-serif;
          font-size: 10px; color: #888;
          margin-bottom: 8px; white-space: nowrap;
        }
        .mlx-btn {
          display: block; text-align: center;
          padding: 6px 0; margin-bottom: 10px;
          background: #1A2535; color: #fff;
          border-radius: 5px;
          font-family: Poppins, sans-serif;
          font-size: 10px; font-weight: 600; letter-spacing: 0.05em;
          text-decoration: none;
        }

        /* Pointer tip */
        .mlx-tip {
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 9px solid #fff;
          filter: drop-shadow(0 3px 4px rgba(0,0,0,0.35));
          flex-shrink: 0;
        }

        /* ── Hover expand ── */
        .mlx-root:hover .mlx-card  { box-shadow: 0 12px 36px rgba(0,0,0,0.55); }
        .mlx-root:hover .mlx-hero    { max-height: 120px; }
        .mlx-root:hover .mlx-details { max-height: 92px; }

        /* ── Leaflet chrome ── */
        .leaflet-control-attribution {
          font-size: 9px !important; opacity: 0.45 !important;
          background: rgba(0,0,0,0.50) !important; color: #ccc !important;
        }
        .leaflet-control-attribution a { color: #999 !important; }
        .leaflet-control-zoom a {
          font-family: Poppins, sans-serif !important;
          color: #1A2535 !important; font-weight: 600 !important;
        }
      `}</style>
    </>
  );
}
