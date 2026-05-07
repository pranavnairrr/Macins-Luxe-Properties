'use client';

import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Grid3X3, Map, ChevronDown, X, Phone, MessageCircle } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import type { ListingRecord } from '@/components/staff/PropertyListingForm';

const PropertiesMapView = dynamic(() => import('@/components/PropertiesMapView'), { ssr: false });

interface Props {
  listings: ListingRecord[];
}

function parsePrice(s: string): number {
  const n = s.replace(/AED\s*/i, '').trim();
  if (n.endsWith('M')) return parseFloat(n) * 1_000_000;
  if (n.endsWith('K')) return parseFloat(n) * 1_000;
  return parseFloat(n.replace(/,/g, '')) || 0;
}

const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: 'Under AED 1M', min: 0, max: 1_000_000 },
  { label: 'AED 1M – 3M', min: 1_000_000, max: 3_000_000 },
  { label: 'AED 3M – 5M', min: 3_000_000, max: 5_000_000 },
  { label: 'AED 5M – 10M', min: 5_000_000, max: 10_000_000 },
  { label: 'AED 10M+', min: 10_000_000, max: Infinity },
];

const BEDS_OPTIONS = ['Any', 'Studio', '1 BR', '2 BR', '3 BR', '4 BR', '5+ BR'];
const TABS = ['All', 'Ready', 'Off-Plan', 'Residential', 'Commercial'] as const;

function BedIcon() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect x="0.5" y="5.5" width="14" height="6" rx="1" stroke="var(--muted)" strokeWidth="1.1"/>
      <rect x="2" y="2" width="5" height="4" rx="0.8" stroke="var(--muted)" strokeWidth="1.1"/>
      <rect x="8" y="2" width="5" height="4" rx="0.8" stroke="var(--muted)" strokeWidth="1.1"/>
      <line x1="0.5" y1="8" x2="14.5" y2="8" stroke="var(--muted)" strokeWidth="1.1"/>
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="11" height="14" viewBox="0 0 11 14" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M5.5 0C2.74 0 0.5 2.24 0.5 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" fill="var(--muted)"/>
      <circle cx="5.5" cy="5" r="1.8" fill="var(--white)"/>
    </svg>
  );
}

function PropertiesInner({ listings }: Props) {
  const params = useSearchParams();

  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');
  const [selectedArea, setSelectedArea] = useState('');
  const [priceRangeIdx, setPriceRangeIdx] = useState(0);
  const [selectedBeds, setSelectedBeds] = useState('Any');
  const [searchText, setSearchText] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [visibleCount, setVisibleCount] = useState(9);
  const [areaOpen, setAreaOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [bedsOpen, setBedsOpen] = useState(false);

  // Mini enquiry form state
  const [miniName, setMiniName] = useState('');
  const [miniPhone, setMiniPhone] = useState('');
  const [miniSent, setMiniSent] = useState(false);

  const areaRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const bedsRef = useRef<HTMLDivElement>(null);

  // Pre-populate from URL params (from hero search)
  useEffect(() => {
    const tab = params.get('tab');
    if (tab && TABS.includes(tab as typeof TABS[number])) setActiveTab(tab as typeof TABS[number]);
    const area = params.get('area');
    if (area) { setSearchText(area); }
  }, [params]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (areaRef.current && !areaRef.current.contains(e.target as Node)) setAreaOpen(false);
      if (priceRef.current && !priceRef.current.contains(e.target as Node)) setPriceOpen(false);
      if (bedsRef.current && !bedsRef.current.contains(e.target as Node)) setBedsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const uniqueAreas = useMemo(() => {
    const set = new Set<string>();
    listings.forEach(l => { if (l.location) set.add(l.location); });
    return ['All Areas', ...Array.from(set).sort()];
  }, [listings]);

  const filtered = useMemo(() => {
    return listings.filter(l => {
      // Tab filter
      if (activeTab === 'Ready' && l.category !== 'premium') return false;
      if (activeTab === 'Off-Plan' && l.category !== 'offplan') return false;
      if (activeTab === 'Commercial') {
        const name = l.name.toLowerCase();
        const loc = l.location.toLowerCase();
        if (!name.includes('commercial') && !name.includes('office') && !loc.includes('commercial')) return false;
      }
      // Area filter
      if (selectedArea && selectedArea !== 'All Areas') {
        if (!l.location.toLowerCase().includes(selectedArea.toLowerCase())) return false;
      }
      // Price filter
      const range = PRICE_RANGES[priceRangeIdx];
      if (range.max !== Infinity || range.min !== 0) {
        const price = parsePrice(l.price);
        if (price < range.min || price > range.max) return false;
      }
      // Beds filter
      if (selectedBeds !== 'Any') {
        const bedsLower = l.beds.toLowerCase();
        const filterLower = selectedBeds.toLowerCase();
        if (!bedsLower.includes(filterLower.replace(' br', '').replace('studio', 'studio'))) return false;
      }
      // Search text
      if (searchText) {
        const q = searchText.toLowerCase();
        const match = l.name.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.developer.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [listings, activeTab, selectedArea, priceRangeIdx, selectedBeds, searchText]);

  const hasActiveFilters = activeTab !== 'All' || selectedArea !== '' || priceRangeIdx !== 0 || selectedBeds !== 'Any' || searchText !== '';

  const handleMiniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/enquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: miniName, phone: miniPhone, email: '', propertyType: 'Viewing Request' }),
      });
      setMiniSent(true);
    } catch { /* silent */ }
  };

  const dropdownStyle = {
    position: 'absolute' as const,
    top: 'calc(100% + 6px)',
    left: 0,
    background: '#fff',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-card-hover)',
    zIndex: 100,
    minWidth: 200,
    padding: '6px 0',
  };

  const dropItemStyle = (active: boolean) => ({
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    padding: '10px 16px',
    background: active ? 'var(--white-section)' : 'transparent',
    fontFamily: 'var(--font)',
    fontSize: '0.875rem',
    color: active ? 'var(--heading)' : 'var(--body)',
    fontWeight: active ? 600 : 400,
    border: 'none',
    cursor: 'pointer',
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white-section)' }}>
      <Nav />

      {/* Page Hero */}
      <section style={{
        background: 'var(--navy)',
        paddingTop: 72 + 56,
        paddingBottom: 56,
      }}>
        <div className="container">
          <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            Home &nbsp;/&nbsp; Properties
          </p>
          <h1 style={{
            fontFamily: 'var(--font)',
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: 12,
          }}>
            Find Your Perfect Property
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: 560 }}>
            Explore our curated collection of luxury homes and investments across the UAE.
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <div className="filter-bar" style={{
        position: 'sticky',
        top: 72,
        zIndex: 40,
        background: '#fff',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 2px 12px rgba(27,48,121,0.06)',
      }}>
        <div className="container" style={{ paddingTop: 0, paddingBottom: 0 }}>
          {/* Tab row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingBlock: 12, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  border: activeTab === tab ? 'none' : '1px solid var(--border)',
                  background: activeTab === tab ? 'var(--heading)' : 'transparent',
                  color: activeTab === tab ? '#fff' : 'var(--body)',
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Controls row */}
          <div className="filter-row" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            paddingBottom: 12,
            flexWrap: 'wrap',
          }}>
            {/* Search input */}
            <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 160 }}>
              <Search size={15} strokeWidth={1.5} color="var(--muted)" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="Search by name, area or developer…"
                style={{
                  width: '100%',
                  paddingLeft: 36,
                  paddingRight: 12,
                  paddingBlock: 9,
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  color: 'var(--heading)',
                  background: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            {/* Area dropdown */}
            <div ref={areaRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setAreaOpen(o => !o); setPriceOpen(false); setBedsOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  background: selectedArea && selectedArea !== 'All Areas' ? 'var(--white-section)' : '#fff',
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  color: 'var(--heading)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedArea && selectedArea !== 'All Areas' ? selectedArea : 'Area'}
                <ChevronDown size={14} strokeWidth={1.5} style={{ transform: areaOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {areaOpen && (
                <div style={{ ...dropdownStyle, maxHeight: 280, overflowY: 'auto' }}>
                  {uniqueAreas.map(a => (
                    <button key={a} onClick={() => { setSelectedArea(a === 'All Areas' ? '' : a); setAreaOpen(false); }}
                      style={dropItemStyle(selectedArea === a || (a === 'All Areas' && !selectedArea))}>
                      {a}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price dropdown */}
            <div ref={priceRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setPriceOpen(o => !o); setAreaOpen(false); setBedsOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  background: priceRangeIdx !== 0 ? 'var(--white-section)' : '#fff',
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  color: 'var(--heading)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {PRICE_RANGES[priceRangeIdx].label === 'Any Price' ? 'Price' : PRICE_RANGES[priceRangeIdx].label}
                <ChevronDown size={14} strokeWidth={1.5} style={{ transform: priceOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {priceOpen && (
                <div style={dropdownStyle}>
                  {PRICE_RANGES.map((r, i) => (
                    <button key={r.label} onClick={() => { setPriceRangeIdx(i); setPriceOpen(false); }}
                      style={dropItemStyle(priceRangeIdx === i)}>
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Beds dropdown */}
            <div ref={bedsRef} style={{ position: 'relative' }}>
              <button
                onClick={() => { setBedsOpen(o => !o); setAreaOpen(false); setPriceOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '9px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-btn)',
                  background: selectedBeds !== 'Any' ? 'var(--white-section)' : '#fff',
                  fontFamily: 'var(--font)',
                  fontSize: '0.875rem',
                  color: 'var(--heading)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedBeds === 'Any' ? 'Bedrooms' : selectedBeds}
                <ChevronDown size={14} strokeWidth={1.5} style={{ transform: bedsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {bedsOpen && (
                <div style={dropdownStyle}>
                  {BEDS_OPTIONS.map(b => (
                    <button key={b} onClick={() => { setSelectedBeds(b); setBedsOpen(false); }}
                      style={dropItemStyle(selectedBeds === b)}>
                      {b}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={() => { setActiveTab('All'); setSelectedArea(''); setPriceRangeIdx(0); setSelectedBeds('Any'); setSearchText(''); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '9px 12px',
                  border: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--font)',
                  fontSize: '0.8125rem',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                <X size={14} strokeWidth={1.5} /> Clear
              </button>
            )}

            {/* View toggle */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
              {(['grid', 'map'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  title={mode === 'grid' ? 'Grid view' : 'Map view'}
                  style={{
                    width: 38, height: 38,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-btn)',
                    background: viewMode === mode ? 'var(--heading)' : '#fff',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  {mode === 'grid'
                    ? <Grid3X3 size={16} strokeWidth={1.5} color={viewMode === 'grid' ? '#fff' : 'var(--heading)'} />
                    : <Map size={16} strokeWidth={1.5} color={viewMode === 'map' ? '#fff' : 'var(--heading)'} />
                  }
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="results-layout">
          {/* Left — results */}
          <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: 24 }}>
              Showing <strong style={{ color: 'var(--heading)' }}>{Math.min(visibleCount, filtered.length)}</strong> of <strong style={{ color: 'var(--heading)' }}>{filtered.length}</strong> properties
            </p>

            {viewMode === 'map' ? (
              <div style={{ height: 560, borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }}>
                <PropertiesMapView listings={filtered} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '80px 40px',
                background: '#fff', borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
              }}>
                <p style={{ fontSize: '1.125rem', color: 'var(--heading)', fontWeight: 600, marginBottom: 8 }}>No properties found</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9375rem' }}>Try adjusting your filters or clearing your search.</p>
              </div>
            ) : (
              <>
                <div className="prop-grid">
                  {filtered.slice(0, visibleCount).map(listing => {
                    const image = listing.images?.[0] ?? '/images/hero/img227.jpg';
                    return (
                      <article
                        key={listing.id}
                        className="prop-card"
                        style={{
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          background: '#fff',
                          boxShadow: 'var(--shadow-card)',
                          display: 'flex',
                          flexDirection: 'column',
                          transition: 'box-shadow 0.32s ease, transform 0.32s cubic-bezier(0.34,1.56,0.64,1)',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(27,48,121,0.18)';
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)';
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-card)';
                          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                        }}
                      >
                        <Link href={`/properties/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', flex: 1 }}>
                          <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
                            <Image src={image} alt={listing.name} fill sizes="(max-width: 768px) 100vw, 33vw"
                              style={{ objectFit: 'cover', transition: 'transform 500ms ease' }}
                              onMouseEnter={e => ((e.target as HTMLElement).style.transform = 'scale(1.04)')}
                              onMouseLeave={e => ((e.target as HTMLElement).style.transform = 'scale(1)')}
                            />
                            <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.48)', color: '#fff', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 4, backdropFilter: 'blur(4px)' }}>
                              {listing.badge}
                            </span>
                            {listing.developer && (
                              <span style={{ position: 'absolute', top: 12, right: 12, background: '#fff', padding: '4px 10px', borderRadius: 4, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--heading)' }}>
                                {listing.developer}
                              </span>
                            )}
                          </div>
                          <div style={{ padding: '20px 20px 0' }}>
                            <h3 style={{ fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 600, lineHeight: 1.35, color: 'var(--heading)', marginBottom: 4 }}>
                              {listing.name}
                            </h3>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 12 }}>by {listing.developer}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                              <div>
                                <div style={{ fontSize: '0.8125rem', color: 'var(--muted)' }}>Starting Price</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)' }}>{listing.price}</div>
                              </div>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1B3079' }}>View Details →</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderTop: '1px solid var(--border)', paddingTop: 12, fontSize: '0.8125rem', color: 'var(--muted)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><BedIcon /> {listing.beds}</span>
                              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><PinIcon /> {listing.location}</span>
                            </div>
                          </div>
                        </Link>
                        <button
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onClick={() => (window as any).__openEnquireModal?.()}
                          style={{
                            display: 'block', width: '100%', padding: 14,
                            background: 'var(--cta-bg)', color: '#fff',
                            fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                            border: 'none', borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                            cursor: 'pointer', transition: 'background 0.2s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#1E2D3D')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'var(--cta-bg)')}
                        >
                          Enquire Now
                        </button>
                      </article>
                    );
                  })}
                </div>

                {visibleCount < filtered.length && (
                  <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button
                      onClick={() => setVisibleCount(v => v + 9)}
                      style={{
                        padding: '14px 40px',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-btn)',
                        background: '#fff',
                        fontFamily: 'var(--font)',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: 'var(--heading)',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s, background 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--heading)'; e.currentTarget.style.background = 'var(--white-section)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = '#fff'; }}
                    >
                      Load More Properties
                    </button>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: 10 }}>
                      Displaying {Math.min(visibleCount, filtered.length)} of {filtered.length}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right — sidebar */}
          <aside className="prop-sidebar">
            {/* Can't find it? CTA */}
            <div style={{
              background: 'var(--navy)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              marginBottom: 20,
            }}>
              <h3 style={{ fontFamily: 'var(--font)', fontSize: '1.0625rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                Can't find what you're looking for?
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', marginBottom: 20, lineHeight: 1.65 }}>
                Our advisors have access to exclusive off-market listings and can match you with properties that suit your exact requirements.
              </p>
              <button
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onClick={() => (window as any).__openEnquireModal?.()}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  width: '100%', padding: '12px 20px',
                  background: '#C9A96E', color: '#fff',
                  fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                  border: 'none', borderRadius: 'var(--radius-btn)',
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                Speak to an Expert
              </button>
            </div>

            {/* Schedule viewing form */}
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: 24,
            }}>
              <h3 style={{ fontFamily: 'var(--font)', fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 6 }}>
                Schedule a Viewing
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginBottom: 18 }}>
                Our team will arrange a private viewing at your convenience.
              </p>
              {miniSent ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <p style={{ color: 'var(--heading)', fontWeight: 600 }}>Request received!</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--muted)', marginTop: 4 }}>We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleMiniSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input
                    value={miniName} onChange={e => setMiniName(e.target.value)}
                    placeholder="Your Name" required
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', fontFamily: 'var(--font)', fontSize: '0.875rem', outline: 'none' }}
                  />
                  <input
                    value={miniPhone} onChange={e => setMiniPhone(e.target.value)}
                    placeholder="Phone / WhatsApp" type="tel" required
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-btn)', fontFamily: 'var(--font)', fontSize: '0.875rem', outline: 'none' }}
                  />
                  <button
                    type="submit"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '11px 20px',
                      background: 'var(--heading)', color: '#fff',
                      fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
                      border: 'none', borderRadius: 'var(--radius-btn)',
                      cursor: 'pointer',
                    }}
                  >
                    <Phone size={15} strokeWidth={1.5} />
                    Request Viewing
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .results-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 32px;
          align-items: start;
        }
        .prop-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--gap);
        }
        @media (max-width: 1200px) {
          .results-layout { grid-template-columns: 1fr 280px; }
        }
        @media (max-width: 900px) {
          .results-layout { grid-template-columns: 1fr; }
          .prop-sidebar { order: -1; }
        }
        @media (max-width: 640px) {
          .prop-grid { grid-template-columns: 1fr; }
          .filter-row { gap: 6px; }
        }
        .filter-bar ::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function PropertiesListingPage({ listings }: Props) {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--white-section)' }} />}>
      <PropertiesInner listings={listings} />
    </Suspense>
  );
}
