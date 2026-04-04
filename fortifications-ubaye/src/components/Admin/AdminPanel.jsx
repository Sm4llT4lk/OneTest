import { useEffect, useState } from 'react'
import { fetchPendingLocations, signOut } from '../../lib/supabase'
import ModerationItem from './ModerationItem'
import { Link } from 'react-router-dom'

export default function AdminPanel() {
  const [locations, setLocations] = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPendingLocations()
      setLocations(data)
    } catch (err) {
      setError('Impossible de charger les soumissions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleUpdate = (id) => {
    setLocations((prev) => prev.filter((l) => l.id !== id))
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-parchment-100">
      {/* Top bar */}
      <header className="bg-stone-800 text-white px-4 sm:px-6 py-3 flex items-center gap-3">
        <Link to="/" className="text-stone-300 hover:text-white transition-colors text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Carte
        </Link>
        <div className="flex-1 text-center">
          <span className="font-serif font-semibold">Panneau de modération</span>
        </div>
        <button
          onClick={handleSignOut}
          className="text-stone-300 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-2xl font-bold text-stone-800">
            Soumissions en attente
          </h1>
          <div className="flex items-center gap-2">
            {!loading && (
              <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-0.5 rounded-full border border-amber-200">
                {locations.length} lieu{locations.length !== 1 ? 'x' : ''}
              </span>
            )}
            <button
              onClick={load}
              className="p-2 text-stone-500 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
              title="Actualiser"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-500">
            <svg className="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Chargement…
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 text-red-600 text-sm">{error}</div>
        )}

        {!loading && !error && locations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-stone-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium text-stone-500">Aucune soumission en attente</p>
            <p className="text-sm">Tout est à jour !</p>
          </div>
        )}

        {!loading && !error && locations.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {locations.map((loc) => (
              <ModerationItem key={loc.id} location={loc} onUpdate={handleUpdate} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
