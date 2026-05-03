'use client'

import { useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import EnquireModal from '@/components/EnquireModal'
import PropertyBrochureDownload from '@/components/PropertyBrochureDownload'
import type { ListingRecord } from '@/components/staff/PropertyListingForm'

const PropertyMap = dynamic(() => import('@/components/PropertyMap'), { ssr: false })

const AMENITY_ICONS: Record<string, string> = {
  'Swimming Pool': '🏊',
  'Gym & Fitness': '💪',
  'Covered Parking': '🚗',
  '24/7 Security': '🔒',
  'Concierge': '🛎',
  'Kids Play Area': '🎠',
  'BBQ Area': '🔥',
  'Sauna & Steam': '💆',
  'Retail Outlets': '🛍',
  'Spa': '🧖',
  'Tennis Court': '🎾',
  'Running Track': '🏃',
  'Rooftop Terrace': '🌇',
  'Smart Home': '📱',
  'EV Charging': '⚡',
  'Jogging Track': '🏅',
  'Basketball Court': '🏀',
  'Pet-Friendly': '🐾',
  'Business Centre': '💼',
  'Cinema Room': '🎬',
  'Infinity Pool': '🌊',
  'Yoga Studio': '🧘',
  'Co-Working Space': '💻',
  'Valet Parking': '🤵',
  'Private Beach': '🏖',
}

interface Props {
  listing: ListingRecord
}

export default function PropertyDetailPage({ listing }: Props) {
  const [activeImg, setActiveImg] = useState(0)

  const images = listing.images.length > 0
    ? listing.images
    : ['/images/properties/Binghatti-Hills-at-Dubai-HIlls.jpeg']

  const hasMap = listing.latitude != null && listing.longitude != null

  return (
    <>
      <Nav />

      {/* Page wrapper — offset for fixed nav */}
      <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--white-section)', fontFamily: 'var(--font)' }}>

        {/* ── Image Gallery ── */}
        <div style={{ background: '#0f1828', position: 'relative' }}>
          {/* Main image */}
          <div style={{ position: 'relative', aspectRatio: '21/9', maxHeight: 580, overflow: 'hidden' }}>
            <Image
              src={images[activeImg]}
              alt={listing.name}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover', transition: 'opacity 0.3s ease' }}
              priority
              unoptimized
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)',
            }} />

            {/* Badge overlay */}
            <div style={{
              position: 'absolute', top: 24, left: 24, display: 'flex', gap: 8,
            }}>
              <span style={{
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
                padding: '6px 14px', borderRadius: 6,
              }}>{listing.badge}</span>
              <span style={{
                background: '#1B3079', color: '#D5BA8C',
                fontSize: '0.75rem', fontWeight: 700,
                padding: '6px 14px', borderRadius: 6,
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>{listing.developer.split(' ')[0]}</span>
            </div>

            {/* Image count */}
            {images.length > 1 && (
              <div style={{
                position: 'absolute', bottom: 20, right: 20,
                background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                color: '#fff', fontSize: '0.8125rem', fontWeight: 600,
                padding: '6px 12px', borderRadius: 6,
              }}>
                {activeImg + 1} / {images.length}
              </div>
            )}

            {/* Prev/Next arrows */}
            {images.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                  style={arrowStyle('left')}>‹</button>
                <button onClick={() => setActiveImg(i => (i + 1) % images.length)}
                  style={arrowStyle('right')}>›</button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div style={{
              display: 'flex', gap: 6, padding: '10px 24px',
              overflowX: 'auto', background: '#0f1828',
            }}>
              {images.map((src, i) => (
                <button key={i} onClick={() => setActiveImg(i)} style={{
                  flexShrink: 0, width: 80, height: 52, borderRadius: 6,
                  overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer',
                  outline: i === activeImg ? '2px solid #D5BA8C' : '2px solid transparent',
                  outlineOffset: 2, transition: 'outline 0.2s',
                }}>
                  <Image src={src} alt={`View ${i + 1}`} width={80} height={52}
                    style={{ width: '100%', height: '100%', objectFit: 'cover',
                      opacity: i === activeImg ? 1 : 0.55, transition: 'opacity 0.2s' }}
                    unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Content ── */}
        <div className="container" style={{ paddingTop: 32, paddingBottom: 80 }}>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '0.8125rem', color: 'var(--muted)' }}>
            <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--navy)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
            >Home</Link>
            <span>›</span>
            <Link href="/#properties" style={{ color: 'var(--muted)', textDecoration: 'none' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--navy)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'var(--muted)')}
            >Properties</Link>
            <span>›</span>
            <span style={{ color: 'var(--heading)', fontWeight: 500 }}>{listing.name}</span>
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}
            className="detail-grid">

            {/* ── LEFT COLUMN ── */}
            <div>

              {/* Title + developer */}
              <div style={{ marginBottom: 28 }}>
                <h1 style={{
                  fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700,
                  color: 'var(--heading)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 6,
                }}>
                  {listing.name}
                </h1>
                <p style={{ fontSize: '1rem', color: 'var(--muted)', fontWeight: 400 }}>
                  by <span style={{ color: 'var(--body)', fontWeight: 500 }}>{listing.developer}</span>
                  {listing.location && <> &nbsp;·&nbsp; 📍 {listing.location}</>}
                </p>
              </div>

              {/* Key stats — only show filled ones */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 32,
              }} className="stats-grid">
                {[
                  listing.price    ? { label: 'Starting Price', value: listing.price } : null,
                  listing.beds     ? { label: 'Bedrooms',        value: listing.beds } : null,
                  listing.location ? { label: 'Location',        value: listing.location } : null,
                  listing.badge    ? { label: 'Handover',        value: listing.badge.replace('Handover: ', '') } : null,
                  listing.size_range ? { label: 'Size Range',    value: listing.size_range } : null,
                ].filter(Boolean).map(stat => (
                  <div key={stat!.label} style={{
                    background: '#fff', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '16px',
                    boxShadow: 'var(--shadow-stat)',
                  }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 500, marginBottom: 4 }}>
                      {stat!.label}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--heading)', lineHeight: 1.3 }}>
                      {stat!.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              {listing.description && (
                <div style={{ marginBottom: 36 }}>
                  <SectionTitle>About This Property</SectionTitle>
                  <p style={{
                    fontSize: '0.9375rem', color: 'var(--body)', lineHeight: 1.75,
                    whiteSpace: 'pre-line',
                  }}>
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Key Highlights */}
              {listing.highlights && listing.highlights.length > 0 && (
                <div style={{ marginBottom: 36 }}>
                  <SectionTitle>Key Highlights</SectionTitle>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {listing.highlights.map((h, i) => (
                      <li key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        fontSize: '0.9375rem', color: 'var(--body)', lineHeight: 1.6,
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%', background: '#D5BA8C',
                          marginTop: 8, flexShrink: 0,
                        }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div style={{ marginBottom: 36 }}>
                  <SectionTitle>Amenities &amp; Features</SectionTitle>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10,
                  }}>
                    {listing.amenities.map(amenity => (
                      <div key={amenity} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        background: '#fff', border: '1px solid var(--border)',
                        borderRadius: 8, padding: '10px 14px',
                        fontSize: '0.875rem', color: 'var(--body)', fontWeight: 500,
                      }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>
                          {AMENITY_ICONS[amenity] ?? '✦'}
                        </span>
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Plan */}
              {listing.payment_plan && (
                <div style={{ marginBottom: 36 }}>
                  <SectionTitle>Payment Plan</SectionTitle>
                  <div style={{
                    background: '#fff', border: '1px solid var(--border)',
                    borderRadius: 10, padding: '20px 24px',
                    fontSize: '0.9375rem', color: 'var(--body)', lineHeight: 1.8,
                    whiteSpace: 'pre-line',
                  }}>
                    {listing.payment_plan}
                  </div>
                </div>
              )}

              {/* Floor Plans */}
              {listing.floor_plans && listing.floor_plans.length > 0 && (
                <div style={{ marginBottom: 36 }}>
                  <SectionTitle>Floor Plans</SectionTitle>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 16,
                  }}>
                    {listing.floor_plans.map((src, i) => (
                      <div key={i} style={{
                        borderRadius: 10, overflow: 'hidden',
                        border: '1px solid var(--border)',
                        background: '#f8f9fb',
                        aspectRatio: '4/3',
                        position: 'relative',
                      }}>
                        <Image src={src} alt={`Floor plan ${i + 1}`} fill
                          style={{ objectFit: 'contain' }} unoptimized />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {hasMap && (
                <div style={{ marginBottom: 36 }}>
                  <SectionTitle>Location</SectionTitle>
                  <div style={{
                    height: 380, borderRadius: 12, overflow: 'hidden',
                    border: '1px solid var(--border)', boxShadow: 'var(--shadow-card)',
                  }}>
                    <PropertyMap
                      lat={listing.latitude!}
                      lng={listing.longitude!}
                      name={listing.name}
                      location={listing.location}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* ── RIGHT SIDEBAR ── */}
            <div style={{ position: 'sticky', top: 92, display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Price + Enquire card */}
              <div style={{
                background: '#fff', border: '1px solid var(--border)',
                borderRadius: 12, padding: '24px',
                boxShadow: 'var(--shadow-card)',
              }}>
                <div style={{ marginBottom: 4, fontSize: '0.8125rem', color: 'var(--muted)' }}>Starting Price</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--heading)', marginBottom: 20 }}>
                  {listing.price || 'Price on Request'}
                </div>

                <button
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onClick={() => (window as any).__openEnquireModal?.()}
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600,
                    color: '#fff', background: '#1B3079',
                    border: 'none', borderRadius: 8, padding: '14px',
                    cursor: 'pointer', transition: 'background 0.2s', marginBottom: 10,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#152567')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#1B3079')}
                >
                  Enquire Now
                </button>

                <a
                  href="https://wa.me/97144542588"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    width: '100%', boxSizing: 'border-box',
                    fontFamily: 'var(--font)', fontSize: '0.9375rem', fontWeight: 600,
                    color: '#25D366', background: 'rgba(37,211,102,0.08)',
                    border: '1px solid rgba(37,211,102,0.30)',
                    borderRadius: 8, padding: '12px',
                    textDecoration: 'none', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.15)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(37,211,102,0.08)')}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.557 4.116 1.523 5.843L.057 23.944l6.244-1.637A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.006-1.367l-.36-.214-3.707.972.989-3.614-.235-.372A9.791 9.791 0 012.182 12C2.182 6.561 6.561 2.182 12 2.182S21.818 6.561 21.818 12 17.439 21.818 12 21.818z"/>
                  </svg>
                  WhatsApp Us
                </a>
              </div>

              {/* Brochure Download */}
              <PropertyBrochureDownload
                listingId={listing.id}
                listingName={listing.name}
                brochureUrl={listing.brochure_url}
              />

            </div>
          </div>
        </div>
      </div>

      <Footer />
      <EnquireModal />

      <style jsx global>{`
        @media (max-width: 1024px) {
          .detail-grid {
            grid-template-columns: 1fr !important;
          }
          .detail-grid > div:last-child {
            position: static !important;
          }
        }
        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font)',
      fontSize: '1.125rem', fontWeight: 700,
      color: 'var(--heading)', marginBottom: 16,
      paddingBottom: 10,
      borderBottom: '2px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <span style={{ display: 'block', width: 3, height: 18, background: '#1B3079', borderRadius: 2, flexShrink: 0 }} />
      {children}
    </h2>
  )
}

const arrowStyle = (side: 'left' | 'right'): React.CSSProperties => ({
  position: 'absolute',
  top: '50%', transform: 'translateY(-50%)',
  [side]: 16,
  width: 40, height: 40,
  background: 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.20)',
  borderRadius: '50%',
  color: '#fff',
  fontSize: '1.5rem', lineHeight: '40px', textAlign: 'center',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'background 0.2s',
  zIndex: 2,
  fontFamily: 'sans-serif',
})
