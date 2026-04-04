import { useEffect, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix default Leaflet icon paths broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom icon per type
const TYPE_COLORS = {
  Fort:        '#b45309',
  Ouvrage:     '#15803d',
  Baraquement: '#1d4ed8',
  Blockhaus:   '#7c3aed',
  Batterie:    '#be123c',
  Casemate:    '#0f766e',
  Tour:        '#a16207',
  Redoute:     '#9f1239',
  Autre:       '#475569',
}

function makeIcon(type, isSelected = false) {
  const color = TYPE_COLORS[type] ?? '#475569'
  const size = isSelected ? 36 : 28
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 8}" viewBox="0 0 32 40">
      <circle cx="16" cy="16" r="12" fill="${color}" stroke="white" stroke-width="2.5"/>
      <polygon points="16,38 10,24 22,24" fill="${color}"/>
      <rect x="11" y="8" width="3" height="5" fill="white" rx="1"/>
      <rect x="18" y="8" width="3" height="5" fill="white" rx="1"/>
      <rect x="9"  y="12" width="14" height="8" fill="white" rx="1"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  })
}

// Capture map clicks when user is picking coordinates
function CoordPicker({ onPick }) {
  useMapEvents({
    click(e) {
      if (onPick) onPick(e.latlng)
    },
  })
  return null
}

export default function MapView({ locations = [], selectedId, onSelect, onCoordPick, pickingCoords }) {
  const CENTER = [44.4350, 6.7300] // Vallée de l'Ubaye
  const ZOOM = 11

  return (
    <MapContainer
      center={CENTER}
      zoom={ZOOM}
      className={`w-full h-full ${pickingCoords ? 'cursor-crosshair' : ''}`}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {pickingCoords && <CoordPicker onPick={onCoordPick} />}

      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.latitude, loc.longitude]}
          icon={makeIcon(loc.type, loc.id === selectedId)}
          eventHandlers={{ click: () => onSelect(loc) }}
        >
          <Popup className="ubaye-popup">
            <div className="text-sm font-medium text-stone-800">{loc.nom}</div>
            <div className="text-xs text-stone-500 mt-0.5">{loc.type}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
