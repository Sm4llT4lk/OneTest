import { useEffect, useState, useCallback } from 'react'
import { fetchApprovedLocations } from '../lib/supabase'
import MapView from '../components/Map/MapView'
import LocationDetailCard from '../components/Map/LocationDetailCard'
import SubmissionForm from '../components/Form/SubmissionForm'
import Header from '../components/UI/Header'
import Modal from '../components/UI/Modal'

export default function HomePage() {
  const [locations,     setLocations]     = useState([])
  const [loading,       setLoading]       = useState(true)
  const [selectedLoc,   setSelectedLoc]   = useState(null)
  const [showForm,      setShowForm]      = useState(false)
  const [pickingCoords, setPickingCoords] = useState(false)
  const [pickedCoords,  setPickedCoords]  = useState(null)

  const loadLocations = useCallback(async () => {
    try {
      const data = await fetchApprovedLocations()
      setLocations(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadLocations() }, [loadLocations])

  // Map click handler – used when user is picking coordinates for the form
  const handleCoordPick = useCallback((latlng) => {
    setPickedCoords(latlng)
    setPickingCoords(false)
    setShowForm(true)
  }, [])

  // User clicked "Cliquer sur la carte" inside the form
  const handleRequestPickCoords = useCallback(() => {
    setShowForm(false)
    setPickingCoords(true)
  }, [])

  const handleOpenForm = useCallback(() => {
    setPickingCoords(false)
    setPickedCoords(null)
    setShowForm(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setShowForm(false)
    setPickingCoords(false)
    setPickedCoords(null)
  }, [])

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header onOpenForm={handleOpenForm} locationCount={locations.length} />

      {/* Map container */}
      <div className="relative flex-1 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-parchment-100/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-stone-600">
              <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span className="text-sm font-medium">Chargement de la carte…</span>
            </div>
          </div>
        )}

        {/* Coord-picking banner */}
        {pickingCoords && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[700] bg-amber-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce-soft">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0z" />
            </svg>
            Cliquez sur la carte pour placer le lieu
            <button
              onClick={() => { setPickingCoords(false); setShowForm(true) }}
              className="ml-2 text-amber-200 hover:text-white underline text-xs"
            >
              Annuler
            </button>
          </div>
        )}

        <MapView
          locations={locations}
          selectedId={selectedLoc?.id}
          onSelect={setSelectedLoc}
          onCoordPick={handleCoordPick}
          pickingCoords={pickingCoords}
        />

        {/* Legend – desktop only */}
        <div className="hidden sm:block absolute bottom-6 left-3 z-[700] bg-white/90 backdrop-blur rounded-xl border border-stone-200 shadow p-3 text-xs text-stone-600 space-y-1 max-w-[160px]">
          <p className="font-semibold text-stone-700 mb-1.5">Légende</p>
          {[
            ['Fort',        '#b45309'],
            ['Ouvrage',     '#15803d'],
            ['Baraquement', '#1d4ed8'],
            ['Blockhaus',   '#7c3aed'],
            ['Batterie',    '#be123c'],
            ['Casemate',    '#0f766e'],
            ['Tour',        '#a16207'],
            ['Redoute',     '#9f1239'],
            ['Autre',       '#475569'],
          ].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Detail card (shown on marker click) */}
      {selectedLoc && (
        <LocationDetailCard
          location={selectedLoc}
          onClose={() => setSelectedLoc(null)}
        />
      )}

      {/* Submission form (side panel on desktop, modal on mobile) */}
      <Modal open={showForm} onClose={handleCloseForm} side={true}>
        <SubmissionForm
          pickedCoords={pickedCoords}
          onRequestPickCoords={handleRequestPickCoords}
          onSuccess={loadLocations}
          onClose={handleCloseForm}
        />
      </Modal>
    </div>
  )
}
