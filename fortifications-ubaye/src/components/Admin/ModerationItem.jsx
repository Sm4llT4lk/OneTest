import { useState } from 'react'
import { updateLocationStatus } from '../../lib/supabase'

const TYPE_COLORS = {
  Fort:        'bg-amber-100 text-amber-800',
  Ouvrage:     'bg-green-100 text-green-800',
  Baraquement: 'bg-blue-100 text-blue-800',
  Blockhaus:   'bg-purple-100 text-purple-800',
  Batterie:    'bg-rose-100 text-rose-800',
  Casemate:    'bg-teal-100 text-teal-800',
  Tour:        'bg-yellow-100 text-yellow-800',
  Redoute:     'bg-red-100 text-red-800',
  Autre:       'bg-stone-100 text-stone-700',
}

export default function ModerationItem({ location, onUpdate }) {
  const [loading, setLoading] = useState(null) // 'approved' | 'rejected'
  const [done, setDone]       = useState(false)

  const handleAction = async (statut) => {
    setLoading(statut)
    try {
      await updateLocationStatus(location.id, statut)
      setDone(true)
      onUpdate?.(location.id, statut)
    } catch {
      setLoading(null)
    }
  }

  if (done) return null

  const typeClass = TYPE_COLORS[location.type] ?? TYPE_COLORS.Autre
  const date = new Date(location.created_at).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Photo thumbnail if available */}
      {location.photo_url && (
        <div className="w-full h-36 overflow-hidden">
          <img src={location.photo_url} alt={location.nom} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h3 className="font-serif text-lg font-semibold text-stone-800 truncate">{location.nom}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeClass}`}>
                {location.type}
              </span>
              <span className="text-xs text-stone-400">{date}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        {location.description && (
          <p className="text-sm text-stone-600 leading-relaxed mb-3 line-clamp-3">
            {location.description}
          </p>
        )}

        {/* Coords + email */}
        <div className="text-xs text-stone-400 font-mono mb-1">
          {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
        </div>
        {location.email_contact && (
          <div className="text-xs text-stone-500 mb-3">
            Contact : <a href={`mailto:${location.email_contact}`} className="text-amber-700 hover:underline">{location.email_contact}</a>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-stone-100">
          <button
            onClick={() => handleAction('approved')}
            disabled={!!loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading === 'approved' ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            Approuver
          </button>
          <button
            onClick={() => handleAction('rejected')}
            disabled={!!loading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loading === 'rejected' ? (
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            Rejeter
          </button>
        </div>
      </div>
    </div>
  )
}
