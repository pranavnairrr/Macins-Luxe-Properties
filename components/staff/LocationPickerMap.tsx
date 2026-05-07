'use client'

import { useEffect, useRef, useState } from 'react'
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'

interface Props {
  lat: string
  lng: string
  onChange: (lat: string, lng: string) => void
}

export default function LocationPickerMap({ lat, lng, onChange }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<LeafletMap | null>(null)
  const markerRef     = useRef<LeafletMarker | null>(null)
  const [search, setSearch]     = useState('')
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    // Dynamically import leaflet only on client
    import('leaflet').then(L => {
      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const initLat = parseFloat(lat) || 25.2048
      const initLng = parseFloat(lng) || 55.2708

      const map = L.map(containerRef.current!, {
        center: [initLat, initLng],
        zoom: lat && lng ? 14 : 11,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom navy/gold marker
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:32px;height:32px;border-radius:50% 50% 50% 0;
          background:#111;border:3px solid rgba(255,255,255,0.25);
          transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.35);
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      })

      if (lat && lng) {
        markerRef.current = L.marker([initLat, initLng], { icon, draggable: true }).addTo(map)
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng()
          onChange(pos.lat.toFixed(6), pos.lng.toFixed(6))
        })
      }

      map.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        const { lat: clickLat, lng: clickLng } = e.latlng
        if (markerRef.current) {
          markerRef.current.setLatLng([clickLat, clickLng])
        } else {
          markerRef.current = L.marker([clickLat, clickLng], { icon, draggable: true }).addTo(map)
          markerRef.current.on('dragend', () => {
            const pos = markerRef.current!.getLatLng()
            onChange(pos.lat.toFixed(6), pos.lng.toFixed(6))
          })
        }
        onChange(clickLat.toFixed(6), clickLng.toFixed(6))
      })

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep marker in sync when lat/lng change externally (typed into inputs)
  useEffect(() => {
    if (!mapRef.current || !lat || !lng) return
    const parsedLat = parseFloat(lat)
    const parsedLng = parseFloat(lng)
    if (isNaN(parsedLat) || isNaN(parsedLng)) return

    import('leaflet').then(L => {
      if (!mapRef.current) return
      if (markerRef.current) {
        markerRef.current.setLatLng([parsedLat, parsedLng])
      } else {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#111;border:3px solid rgba(255,255,255,0.25);transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
          iconSize: [32, 32], iconAnchor: [16, 32],
        })
        markerRef.current = L.marker([parsedLat, parsedLng], { icon, draggable: true }).addTo(mapRef.current)
        markerRef.current.on('dragend', () => {
          const pos = markerRef.current!.getLatLng()
          onChange(pos.lat.toFixed(6), pos.lng.toFixed(6))
        })
      }
      mapRef.current.setView([parsedLat, parsedLng], 14)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng])

  const handleSearch = async () => {
    if (!search.trim()) return
    setSearching(true)
    setSearchError('')
    try {
      const q = encodeURIComponent(`${search.trim()}, Dubai`)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=ae`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (!data.length) {
        setSearchError('Location not found. Try a more specific name.')
        setSearching(false)
        return
      }
      const { lat: rLat, lon: rLon } = data[0]
      onChange(parseFloat(rLat).toFixed(6), parseFloat(rLon).toFixed(6))
      // map + marker update handled by the useEffect above
    } catch {
      setSearchError('Search failed. Check your connection.')
    }
    setSearching(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Search bar */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Search area, community or landmark…"
          style={{
            flex: 1, fontFamily: 'var(--font)', fontSize: '0.875rem',
            color: 'var(--heading)', background: '#fff',
            border: '1px solid var(--border)', borderRadius: 6,
            padding: '9px 12px', outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          style={{
            fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600,
            color: '#fff', background: '#111', border: 'none',
            borderRadius: 6, padding: '9px 16px', cursor: searching ? 'wait' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {searching ? '…' : 'Search'}
        </button>
      </div>
      {searchError && (
        <p style={{ fontSize: '0.8125rem', color: 'var(--red)', fontFamily: 'var(--font)', margin: 0 }}>
          {searchError}
        </p>
      )}

      {/* Map */}
      <div style={{ position: 'relative' }}>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <div
          ref={containerRef}
          style={{ height: 320, borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}
        />
        <div style={{
          position: 'absolute', bottom: 8, left: 8, zIndex: 1000,
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)',
          borderRadius: 4, padding: '4px 8px',
          fontSize: '0.6875rem', color: 'var(--muted)', fontFamily: 'var(--font)',
          pointerEvents: 'none',
        }}>
          Click map to pin · Drag pin to adjust
        </div>
      </div>
    </div>
  )
}
