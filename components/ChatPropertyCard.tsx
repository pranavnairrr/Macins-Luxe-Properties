'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, Tag } from 'lucide-react';
import CinemaImage from '@/components/CinemaImage';

interface Props {
  id: string;
  name: string;
  price: string;
  location: string;
  beds: string;
  badge?: string;
  developer: string;
  imageUrl?: string | null;
  category?: string;
}

export default function ChatPropertyCard({ id, name, price, location, beds, badge, developer, imageUrl, category }: Props) {
  const [hovered, setHovered] = useState(false);

  const fallbackSrc = 'https://dqnrbbfiebnsjheznriy.supabase.co/storage/v1/object/public/property-images/placeholder.jpg';

  return (
    <Link
      href={`/properties/${id}`}
      style={{
        display: 'block',
        width: 220,
        flexShrink: 0,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(213,186,140,0.18)',
        boxShadow: hovered ? 'var(--shadow-card-hover)' : 'var(--shadow-card)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 220ms var(--ease), box-shadow 220ms var(--ease)',
        textDecoration: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', height: 130 }}>
        {imageUrl ? (
          <CinemaImage
            src={imageUrl}
            alt={name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'var(--navy-light)' }} />
        )}
        {/* Badge */}
        {badge && (
          <span style={{
            position: 'absolute',
            top: 8,
            left: 8,
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(6px)',
            color: '#fff',
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font)',
          }}>
            {badge}
          </span>
        )}
        {/* Category pill */}
        {category && (
          <span style={{
            position: 'absolute',
            top: 8,
            right: 8,
            background: category === 'offplan' ? 'rgba(213,186,140,0.85)' : 'rgba(3,33,61,0.80)',
            color: category === 'offplan' ? '#1a1a1a' : '#fff',
            fontSize: 9,
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font)',
          }}>
            {category === 'offplan' ? 'Off-Plan' : 'Ready'}
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '10px 12px 12px' }}>
        <div style={{
          fontFamily: 'var(--font)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--white-text)',
          marginBottom: 4,
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {name}
        </div>

        <div style={{
          fontFamily: 'var(--font)',
          fontSize: 12,
          fontWeight: 700,
          color: 'var(--gold)',
          marginBottom: 6,
        }}>
          {price}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={11} color="var(--white-muted)" strokeWidth={1.5} />
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--white-muted)', lineHeight: 1 }}>
              {location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <BedDouble size={11} color="var(--white-muted)" strokeWidth={1.5} />
            <span style={{ fontFamily: 'var(--font)', fontSize: 11, color: 'var(--white-muted)', lineHeight: 1 }}>
              {beds}
            </span>
          </div>
        </div>

        <div style={{
          marginTop: 10,
          textAlign: 'center',
          background: 'rgba(213,186,140,0.12)',
          border: '1px solid rgba(213,186,140,0.3)',
          borderRadius: 'var(--radius-btn)',
          padding: '5px 8px',
          fontFamily: 'var(--font)',
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--gold)',
          letterSpacing: '0.04em',
        }}>
          View Details
        </div>
      </div>
    </Link>
  );
}
