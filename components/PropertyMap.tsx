'use client'

import { useEffect, useRef } from 'react'

interface Props {
  lat: number
  lng: number
  name: string
  location: string
}

export default function PropertyMap({ lat, lng, name, location }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<unknown>(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return

    import('leaflet').then(L => {
      // Fix default marker icons
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current!, {
        center: [lat, lng],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            background: #111;
            color: #fff;
            font-family: 'Poppins', sans-serif;
            font-size: 12px;
            font-weight: 600;
            padding: 7px 12px;
            border-radius: 8px;
            white-space: nowrap;
            box-shadow: 0 4px 16px rgba(0,0,0,0.35);
            border: 2px solid rgba(255,255,255,0.20);
            position: relative;
          ">
            📍 ${name}
            <div style="
              position: absolute; bottom: -8px; left: 50%;
              transform: translateX(-50%);
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-top: 8px solid #111;
            "></div>
          </div>`,
        iconAnchor: [60, 44],
      })

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<b>${name}</b><br/>${location}`)

      instanceRef.current = map
    })

    return () => {
      if (instanceRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (instanceRef.current as any).remove()
        instanceRef.current = null
      }
    }
  }, [lat, lng, name, location])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 12 }} />
    </>
  )
}
