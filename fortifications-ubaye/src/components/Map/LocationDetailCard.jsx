const TYPE_LABELS = {
  Fort:        { bg: 'bg-amber-100',   text: 'text-amber-800',  border: 'border-amber-300' },
  Ouvrage:     { bg: 'bg-green-100',   text: 'text-green-800',  border: 'border-green-300' },
  Baraquement: { bg: 'bg-blue-100',    text: 'text-blue-800',   border: 'border-blue-300' },
  Blockhaus:   { bg: 'bg-purple-100',  text: 'text-purple-800', border: 'border-purple-300' },
  Batterie:    { bg: 'bg-rose-100',    text: 'text-rose-800',   border: 'border-rose-300' },
  Casemate:    { bg: 'bg-teal-100',    text: 'text-teal-800',   border: 'border-teal-300' },
  Tour:        { bg: 'bg-yellow-100',  text: 'text-yellow-800', border: 'border-yellow-300' },
  Redoute:     { bg: 'bg-red-100',     text: 'text-red-800',    border: 'border-red-300' },
  Autre:       { bg: 'bg-stone-100',   text: 'text-stone-700',  border: 'border-stone-300' },
}

export default function LocationDetailCard({ location, onClose }) {
  if (!location) return null

  const style = TYPE_LABELS[location.type] ?? TYPE_LABELS.Autre
  const coords = `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Card */}
      <div
        className="relative z-10 w-full sm:max-w-lg bg-parchment-50 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photo */}
        {location.photo_url && (
          <div className="w-full h-48 sm:h-56 overflow-hidden">
            <img
              src={location.photo_url}
              alt={location.nom}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* No photo placeholder */}
        {!location.photo_url && (
          <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
            <svg className="w-16 h-16 text-stone-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-800 leading-tight">
                {location.nom}
              </h2>
              <span className={`inline-block mt-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
                {location.type}
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors p-1 -mt-1 -mr-1"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Description */}
          {location.description && (
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
              {location.description}
            </p>
          )}

          {/* Coordinates */}
          <div className="flex items-center gap-2 text-xs text-stone-500 border-t border-stone-200 pt-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-mono">{coords}</span>
            <a
              href={`https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-amber-700 hover:text-amber-900 underline underline-offset-2"
            >
              Voir sur OSM
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
