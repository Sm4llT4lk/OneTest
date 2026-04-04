import { useState } from 'react'
import { signIn } from '../../lib/supabase'

export default function AdminLogin({ onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email, password)
      onLogin?.()
    } catch (err) {
      setError('Identifiants incorrects. Vérifiez votre email et mot de passe.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-parchment-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-800 mb-4">
            <svg className="w-8 h-8 text-parchment-100" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67V11c0 3.9-2.64 7.53-6 8.93-3.36-1.4-6-5.03-6-8.93V7.67L12 5zm-1 3v4H9l3 4 3-4h-2V8h-2z"/>
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-stone-800">Administration</h1>
          <p className="text-stone-500 text-sm mt-1">Fortifications de l'Ubaye</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="form-label">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-stone-800 hover:bg-stone-900 disabled:opacity-60 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Connexion…
                </>
              ) : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">
          Accès réservé aux modérateurs autorisés
        </p>
      </div>
    </div>
  )
}
