'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, MapPin, ChevronDown, ArrowUpRight } from 'lucide-react';
import type { ListingRecord } from '@/components/staff/PropertyListingForm';

/* ── Types ───────────────────────────────────────────────── */
interface AreaRow {
  slug: string;
  name: string;
  avg_price_per_sqft: string;
  rental_yield: string;
  lat: number;
  lng: number;
  property_types: string[];
}

interface Props {
  listings: ListingRecord[];
  areas: AreaRow[];
}

/* ── Helpers ─────────────────────────────────────────────── */
function parsePrice(s: string): number {
  const t = s.replace(/AED\s*/i, '').trim();
  if (t.endsWith('M')) return parseFloat(t) * 1_000_000;
  if (t.endsWith('K')) return parseFloat(t) * 1_000;
  return parseFloat(t.replace(/,/g, '')) || 0;
}

function pinLabel(price: string): string {
  const n = parsePrice(price);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(Math.round(n));
}

const TABS = ['All', 'Ready', 'Off-Plan'] as const;
type Tab = typeof TABS[number];

const PRICE_RANGES = [
  { label: 'Any Price',    min: 0,          max: Infinity   },
  { label: '< AED 1M',    min: 0,          max: 1_000_000  },
  { label: '1M – 3M',     min: 1_000_000,  max: 3_000_000  },
  { label: '3M – 5M',     min: 3_000_000,  max: 5_000_000  },
  { label: '5M – 10M',    min: 5_000_000,  max: 10_000_000 },
  { label: '10M+',        min: 10_000_000, max: Infinity   },
];

const BEDS = ['Any', 'Studio', '1', '2', '3', '4', '5+'];

/* ── MapPage ─────────────────────────────────────────────── */
export default function MapPage({ listings, areas }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef      = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef  = useRef<Map<string, any>>(new Map());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const aMarkersRef = useRef<any[]>([]);
  const listPanelRef = useRef<HTMLDivElement>(null);

  const [activeTab,     setActiveTab]     = useState<Tab>('All');
  const [priceIdx,      setPriceIdx]      = useState(0);
  const [beds,          setBeds]          = useState('Any');
  const [search,        setSearch]        = useState('');
  const [selectedId,    setSelectedId]    = useState<string | null>(null);
  const [selectedArea,  setSelectedArea]  = useState<AreaRow | null>(null);
  const [priceOpen,     setPriceOpen]     = useState(false);
  const priceRef = useRef<HTMLDivElement>(null);

  /* ── Filtered listings ─────────────────────────────────── */
  const filtered = useMemo(() => {
    return listings.filter(l => {
      if (activeTab === 'Ready'    && l.category !== 'premium') return false;
      if (activeTab === 'Off-Plan' && l.category !== 'offplan') return false;
      const range = PRICE_RANGES[priceIdx];
      if (range.min || range.max !== Infinity) {
        const p = parsePrice(l.price);
        if (p < range.min || p > range.max) return false;
      }
      if (beds !== 'Any') {
        if (!l.beds.toLowerCase().includes(beds === 'Studio' ? 'studio' : beds)) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (!l.name.toLowerCase().includes(q) &&
            !l.location.toLowerCase().includes(q) &&
            !l.developer.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [listings, activeTab, priceIdx, beds, search]);

  const mappable = useMemo(() =>
    filtered.filter(l => l.latitude != null && l.longitude != null),
  [filtered]);

  /* ── Close price dropdown on outside click ─────────────── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── Select handler ────────────────────────────────────── */
  const handleSelect = useCallback((id: string) => {
    setSelectedId(prev => prev === id ? null : id);
    setSelectedArea(null);
  }, []);

  const handleAreaSelect = useCallback((area: AreaRow) => {
    setSelectedArea(prev => prev?.slug === area.slug ? null : area);
    setSelectedId(null);
  }, []);

  /* ── Init map (once) ───────────────────────────────────── */
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let L: any;

    (async () => {
      L = (await import('leaflet')).default;
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

      const map = L.map(container, {
        center: [25.115, 55.22],
        zoom: 11,
        zoomControl: false,
        scrollWheelZoom: true,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        },
      ).addTo(map);

      mapRef.current = map;

      // Area markers (static — added once)
      areas.forEach(a => {
        if (!a.lat || !a.lng) return;
        const el = L.divIcon({
          className: 'pp-area-icon',
          html: `<div class="pp-area" data-area-slug="${a.slug}">
            <div class="pp-area-name">${a.name}</div>
            <div class="pp-area-sub">${a.avg_price_per_sqft}/sqft · ${a.rental_yield} yield</div>
          </div>`,
          iconSize: [1, 1],
          iconAnchor: [0, 0],
        });
        const marker = L.marker([a.lat, a.lng], { icon: el, zIndexOffset: -100 }).addTo(map);
        aMarkersRef.current.push(marker);
      });

      // Event delegation — listing pins
      container.addEventListener('click', (e: Event) => {
        const pin = (e.target as Element).closest('.pp-pin[data-id]');
        if (pin) {
          const id = (pin as HTMLElement).dataset.id!;
          setSelectedId(prev => {
            if (prev !== id) {
              document.querySelectorAll('.pp-pin--selected').forEach(el => el.classList.remove('pp-pin--selected'));
              pin.classList.add('pp-pin--selected');
            } else {
              pin.classList.remove('pp-pin--selected');
              return null;
            }
            return id;
          });
          setSelectedArea(null);
          return;
        }
        // Area pins
        const aPin = (e.target as Element).closest('.pp-area[data-area-slug]');
        if (aPin) {
          const slug = (aPin as HTMLElement).dataset.areaSlug!;
          const area = areas.find(a => a.slug === slug);
          if (area) {
            setSelectedArea(prev => (prev?.slug === slug ? null : area));
            setSelectedId(null);
          }
        }
      });
    })();

    return () => {
      isMounted = false;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Sync listing markers when filtered changes ────────── */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    (async () => {
      const L = (await import('leaflet')).default;

      // Remove old markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current.clear();

      // Add new markers
      mappable.forEach(l => {
        const isSelected = l.id === selectedId;
        const icon = L.divIcon({
          className: 'pp-icon',
          html: `<div class="pp-pin${isSelected ? ' pp-pin--selected' : ''}" data-id="${l.id}">${pinLabel(l.price)}</div>`,
          iconSize: [1, 1],
          iconAnchor: [0, 0],
        });
        const marker = L.marker([l.latitude!, l.longitude!], { icon }).addTo(map);
        markersRef.current.set(String(l.id), marker);
      });
    })();
  // We intentionally exclude selectedId here — selection styling is handled separately
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappable]);

  /* ── Pan + highlight when selectedId changes ───────────── */
  useEffect(() => {
    // Update DOM classes
    document.querySelectorAll('.pp-pin--selected').forEach(el => el.classList.remove('pp-pin--selected'));
    if (selectedId) {
      document.querySelector(`.pp-pin[data-id="${selectedId}"]`)?.classList.add('pp-pin--selected');

      const listing = filtered.find(l => String(l.id) === selectedId);
      if (listing?.latitude && listing?.longitude && mapRef.current) {
        mapRef.current.panTo([listing.latitude, listing.longitude], { animate: true, duration: 0.5 });
      }

      // Scroll the card into view in the left panel
      setTimeout(() => {
        document.getElementById(`mc-${selectedId}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 120);
    }
  }, [selectedId, filtered]);

  /* ── Clear selection if filtered changes remove the selected listing */
  useEffect(() => {
    if (selectedId && !filtered.find(l => String(l.id) === selectedId)) {
      setSelectedId(null);
    }
  }, [filtered, selectedId]);

  const clearFilters = () => {
    setActiveTab('All'); setPriceIdx(0); setBeds('Any'); setSearch('');
  };
  const hasFilters = activeTab !== 'All' || priceIdx !== 0 || beds !== 'Any' || search !== '';

  return (
    <>
      <div className="map-layout" style={{ display: 'flex', height: 'calc(100dvh - 72px)' }}>

        {/* ── Left panel ── */}
        <div className="map-left" style={{
          width: 360, flexShrink: 0,
          display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)',
          background: 'var(--white)',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 16px 0', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search size={15} strokeWidth={1.5} color="var(--muted)"
                style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search properties or areas…"
                style={{
                  width: '100%', paddingLeft: 34, paddingRight: 32, paddingBlock: 9,
                  border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)',
                  fontFamily: 'var(--font)', fontSize: '0.875rem',
                  color: 'var(--heading)', background: 'var(--white-section)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{
                  position: 'absolute', right: 9, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                }}>
                  <X size={13} strokeWidth={2} color="var(--muted)" />
                </button>
              )}
            </div>

            {/* Tabs + filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 12, flexWrap: 'wrap' }}>
              {TABS.map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  padding: '5px 12px', borderRadius: 'var(--radius-pill)',
                  border: activeTab === t ? 'none' : '1px solid var(--border)',
                  background: activeTab === t ? 'var(--navy)' : 'transparent',
                  color: activeTab === t ? '#fff' : 'var(--body)',
                  fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {t}
                </button>
              ))}

              {/* Price dropdown */}
              <div ref={priceRef} style={{ position: 'relative', marginLeft: 'auto' }}>
                <button onClick={() => setPriceOpen(o => !o)} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '5px 10px',
                  border: `1px solid ${priceIdx !== 0 ? 'var(--navy)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-btn)',
                  background: priceIdx !== 0 ? 'var(--white-section)' : 'transparent',
                  fontFamily: 'var(--font)', fontSize: '0.8125rem',
                  color: 'var(--heading)', cursor: 'pointer', whiteSpace: 'nowrap',
                  fontWeight: priceIdx !== 0 ? 600 : 400,
                }}>
                  {priceIdx === 0 ? 'Price' : PRICE_RANGES[priceIdx].label}
                  <ChevronDown size={12} strokeWidth={1.5} style={{ transform: priceOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {priceOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 5px)', right: 0,
                    background: '#fff', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card-hover)',
                    zIndex: 200, minWidth: 180, padding: '5px 0',
                  }}>
                    {PRICE_RANGES.map((r, i) => (
                      <button key={r.label} onClick={() => { setPriceIdx(i); setPriceOpen(false); }}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '9px 14px', border: 'none',
                          background: priceIdx === i ? 'var(--white-section)' : 'transparent',
                          fontFamily: 'var(--font)', fontSize: '0.875rem',
                          color: 'var(--heading)', fontWeight: priceIdx === i ? 600 : 400,
                          cursor: 'pointer',
                        }}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Beds pills */}
            <div style={{ display: 'flex', gap: 5, paddingBottom: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {BEDS.map(b => (
                <button key={b} onClick={() => setBeds(b)} style={{
                  padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                  border: `1px solid ${beds === b ? 'var(--navy)' : 'var(--border)'}`,
                  background: beds === b ? 'var(--navy)' : 'transparent',
                  color: beds === b ? '#fff' : 'var(--body)',
                  fontFamily: 'var(--font)', fontSize: '0.75rem', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {b === 'Any' ? 'Any beds' : b === 'Studio' ? 'Studio' : `${b} BR`}
                </button>
              ))}
            </div>
          </div>

          {/* Area info panel */}
          {selectedArea && (
            <div style={{
              margin: '12px 12px 0',
              padding: '14px 16px',
              background: 'var(--white-section)', border: '1px solid var(--border)',
              borderRadius: 10, flexShrink: 0,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 3 }}>
                    Area
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)' }}>
                    {selectedArea.name}
                  </div>
                </div>
                <button onClick={() => setSelectedArea(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X size={14} strokeWidth={2} color="var(--muted)" />
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Avg. Price/sqft', value: selectedArea.avg_price_per_sqft },
                  { label: 'Rental Yield', value: selectedArea.rental_yield },
                ].map(s => (
                  <div key={s.label} style={{
                    background: 'var(--white)', border: '1px solid var(--border)',
                    borderRadius: 7, padding: '8px 10px',
                  }}>
                    <div style={{ fontSize: '0.625rem', color: 'var(--muted)', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--heading)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
              <Link
                href={`/areas/${selectedArea.slug}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center',
                  padding: '8px 14px', background: 'var(--navy)', color: '#fff',
                  borderRadius: 'var(--radius-btn)', fontSize: '0.8125rem', fontWeight: 600,
                  textDecoration: 'none', fontFamily: 'var(--font)',
                }}
              >
                View area guide <ArrowUpRight size={13} strokeWidth={2} />
              </Link>
            </div>
          )}

          {/* Result count */}
          <div style={{
            padding: '10px 16px',
            fontSize: '0.8125rem', color: 'var(--muted)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexShrink: 0,
          }}>
            <span>
              <strong style={{ color: 'var(--heading)' }}>{filtered.length}</strong>
              {' '}{filtered.length === 1 ? 'property' : 'properties'}
              {mappable.length < filtered.length && ` · ${mappable.length} on map`}
            </span>
            {hasFilters && (
              <button onClick={clearFilters} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '0.75rem', color: 'var(--muted)', fontFamily: 'var(--font)',
                display: 'flex', alignItems: 'center', gap: 3,
              }}>
                <X size={12} strokeWidth={2} /> Clear
              </button>
            )}
          </div>

          {/* Listing cards */}
          <div ref={listPanelRef} style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                <MapPin size={28} strokeWidth={1} color="var(--border)" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--heading)', marginBottom: 6 }}>
                  No properties found
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 16 }}>
                  Try adjusting your filters.
                </div>
                <button onClick={clearFilters} style={{
                  padding: '8px 18px', background: 'var(--navy)', color: '#fff',
                  border: 'none', borderRadius: 'var(--radius-btn)',
                  fontFamily: 'var(--font)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer',
                }}>
                  Clear filters
                </button>
              </div>
            ) : (
              filtered.map(l => {
                const img = l.images?.[0] ?? '/images/hero/img227.jpg';
                const isSelected = String(l.id) === selectedId;
                const hasCoordsStyle = l.latitude != null ? {} : {
                  opacity: 0.55,
                };
                return (
                  <button
                    key={l.id}
                    id={`mc-${l.id}`}
                    onClick={() => handleSelect(String(l.id))}
                    style={{
                      display: 'flex', gap: 12, padding: '13px 16px',
                      background: isSelected ? 'rgba(3,33,61,0.04)' : 'transparent',
                      borderLeft: `3px solid ${isSelected ? 'var(--navy)' : 'transparent'}`,
                      border: 'none',
                      borderBottom: '1px solid var(--border)',
                      cursor: 'pointer', width: '100%', textAlign: 'left',
                      transition: 'background 0.15s, border-left-color 0.15s',
                      ...hasCoordsStyle,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--white-section)'; }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {/* Thumbnail */}
                    <div style={{
                      width: 82, height: 62, borderRadius: 7,
                      overflow: 'hidden', flexShrink: 0,
                      border: '1px solid var(--border)',
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.875rem', fontWeight: 600, color: 'var(--heading)',
                        marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {l.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 6 }}>
                        {l.location} · {l.beds}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--navy)' }}>
                          {l.price}
                        </div>
                        <span style={{
                          fontSize: '0.6875rem', fontWeight: 600,
                          padding: '2px 8px', borderRadius: 4,
                          background: 'rgba(0,0,0,0.06)', color: 'var(--muted)',
                        }}>
                          {l.badge}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}

            {/* View details link for selected listing */}
            {selectedId && (
              <div style={{
                position: 'sticky', bottom: 0,
                padding: '10px 16px',
                background: 'var(--white)',
                borderTop: '1px solid var(--border)',
              }}>
                <Link
                  href={`/properties/${selectedId}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '11px', background: 'var(--navy)', color: '#fff',
                    borderRadius: 'var(--radius-btn)', textDecoration: 'none',
                    fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                  }}
                >
                  View details <ArrowUpRight size={14} strokeWidth={2} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Map ── */}
        <div style={{ flex: 1, position: 'relative' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* No coordinates notice */}
          {mappable.length === 0 && filtered.length > 0 && (
            <div style={{
              position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(255,255,255,0.95)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '10px 18px',
              boxShadow: 'var(--shadow-card)',
              fontSize: '0.8125rem', color: 'var(--muted)', zIndex: 500,
              backdropFilter: 'blur(8px)', whiteSpace: 'nowrap',
            }}>
              {filtered.length} {filtered.length === 1 ? 'property' : 'properties'} found — no map coordinates yet
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        /* Listing price pins */
        .pp-icon { background: none !important; border: none !important; overflow: visible !important; }
        .pp-pin {
          position: absolute;
          transform: translate(-50%, calc(-100% - 7px));
          background: var(--navy);
          color: #fff;
          padding: 5px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          font-family: Poppins, sans-serif;
          white-space: nowrap;
          cursor: pointer;
          border: 2px solid #fff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
          transition: transform 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
          z-index: 400;
          user-select: none;
        }
        .pp-pin::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border: 5px solid transparent;
          border-top: 6px solid var(--navy);
          transition: border-top-color 0.15s;
        }
        .pp-pin:hover {
          transform: translate(-50%, calc(-100% - 7px)) scale(1.1);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          z-index: 600 !important;
        }
        .pp-pin--selected {
          background: var(--gold) !important;
          color: #1A2535 !important;
          transform: translate(-50%, calc(-100% - 7px)) scale(1.15) !important;
          box-shadow: 0 6px 20px rgba(0,0,0,0.35) !important;
          z-index: 600 !important;
          border-color: rgba(255,255,255,0.9) !important;
        }
        .pp-pin--selected::after {
          border-top-color: var(--gold) !important;
        }

        /* Area markers */
        .pp-area-icon { background: none !important; border: none !important; overflow: visible !important; }
        .pp-area {
          position: absolute;
          transform: translate(-50%, -50%);
          background: rgba(255,255,255,0.82);
          border: 1.5px solid rgba(213,186,140,0.5);
          border-radius: 8px;
          padding: 5px 10px;
          backdrop-filter: blur(6px);
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 1px 6px rgba(0,0,0,0.10);
          transition: border-color 0.15s, box-shadow 0.15s;
          z-index: 300;
          pointer-events: all;
        }
        .pp-area:hover {
          border-color: var(--gold);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 500 !important;
        }
        .pp-area-name {
          font-size: 10.5px;
          font-weight: 700;
          color: var(--heading);
          font-family: Poppins, sans-serif;
        }
        .pp-area-sub {
          font-size: 9.5px;
          color: var(--muted);
          font-family: Poppins, sans-serif;
          margin-top: 1px;
        }

        /* Leaflet overrides */
        .leaflet-control-attribution {
          font-size: 9px !important;
          opacity: 0.45 !important;
          background: rgba(255,255,255,0.7) !important;
        }
        .leaflet-control-zoom {
          border: 1px solid var(--border) !important;
          border-radius: 8px !important;
          overflow: hidden;
          box-shadow: var(--shadow-card) !important;
          margin-bottom: 16px !important;
          margin-right: 16px !important;
        }
        .leaflet-control-zoom a {
          background: var(--white) !important;
          color: var(--heading) !important;
          border-bottom: 1px solid var(--border) !important;
          font-size: 16px !important;
          line-height: 26px !important;
          width: 32px !important;
          height: 32px !important;
        }
        .leaflet-control-zoom a:last-child { border-bottom: none !important; }
        .leaflet-control-zoom a:hover { background: var(--white-section) !important; }

        /* Mobile layout */
        @media (max-width: 768px) {
          .map-layout { flex-direction: column !important; }
          .map-left {
            width: 100% !important;
            height: 45vh !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
          }
        }
      `}</style>
    </>
  );
}
