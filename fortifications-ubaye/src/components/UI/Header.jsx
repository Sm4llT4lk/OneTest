import { Link } from 'react-router-dom'

export default function Header({ onOpenForm, locationCount }) {
  return (
    <header className="relative z-[900] bg-stone-800/95 backdrop-blur-sm text-white shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
        {/* Logo + titre */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 bg-amber-600 rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-bold text-base sm:text-lg leading-tight truncate">
              Fortifications de l'Ubaye
            </h1>
            {locationCount != null && (
              <p className="text-xs text-stone-400 leading-none hidden sm:block">
                {locationCount} site{locationCount !== 1 ? 's' : ''} répertorié{locationCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenForm}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Proposer un lieu</span>
            <span className="sm:hidden">Ajouter</span>
          </button>

          <Link
            to="/admin"
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-colors"
            title="Administration"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
