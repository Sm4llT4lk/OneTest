import { useState, useCallback } from 'react'
import { submitLocation, uploadPhoto } from '../../lib/supabase'

const TYPES = ['Fort', 'Ouvrage', 'Baraquement', 'Blockhaus', 'Batterie', 'Casemate', 'Tour', 'Redoute', 'Autre']

const EMPTY = {
  nom: '',
  type: '',
  description: '',
  latitude: '',
  longitude: '',
  email_contact: '',
}

export default function SubmissionForm({ pickedCoords, onRequestPickCoords, onSuccess, onClose }) {
  const [form, setForm]       = useState({ ...EMPTY })
  const [photo, setPhoto]     = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(false)

  // Sync coords from map pick
  if (
    pickedCoords &&
    (String(pickedCoords.lat) !== form.latitude || String(pickedCoords.lng) !== form.longitude)
  ) {
    setForm((f) => ({
      ...f,
      latitude:  pickedCoords.lat.toFixed(6),
      longitude: pickedCoords.lng.toFixed(6),
    }))
  }

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }, [])

  const handlePhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      setError('La photo ne doit pas dépasser 10 Mo.')
      return
    }
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!form.nom.trim())  return setError('Le nom est obligatoire.')
    if (!form.type)        return setError('Veuillez choisir un type.')
    const lat = parseFloat(form.latitude)
    const lng = parseFloat(form.longitude)
    if (isNaN(lat) || isNaN(lng)) return setError('Coordonnées GPS invalides.')
    if (lat < 44 || lat > 45 || lng < 6 || lng > 8)
      return setError('Les coordonnées semblent hors de la vallée de l\'Ubaye.')

    setLoading(true)
    try {
      let photo_url = null
      if (photo) photo_url = await uploadPhoto(photo)

      await submitLocation({
        nom:           form.nom.trim(),
        type:          form.type,
        description:   form.description.trim() || null,
        latitude:      lat,
        longitude:     lng,
        email_contact: form.email_contact.trim() || null,
        photo_url,
      })
      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError(err.message ?? 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 px-6 gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-bold text-stone-800">Soumission envoyée !</h3>
        <p className="text-stone-500 text-sm max-w-xs">
          Votre lieu a bien été reçu et sera examiné par un modérateur avant d'apparaître sur la carte.
        </p>
        <button
          onClick={onClose}
          className="mt-2 px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Fermer
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6 overflow-y-auto max-h-[80vh] sm:max-h-none">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-stone-800">Proposer un lieu</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-stone-400 hover:text-stone-600 p-1 transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Nom */}
      <div>
        <label className="form-label">Nom du lieu <span className="text-red-500">*</span></label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Ex : Fort de Tournoux"
          className="form-input"
          required
        />
      </div>

      {/* Type */}
      <div>
        <label className="form-label">Type <span className="text-red-500">*</span></label>
        <select name="type" value={form.type} onChange={handleChange} className="form-input" required>
          <option value="">-- Choisir un type --</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Histoire, état de conservation, accès…"
          rows={3}
          className="form-input resize-none"
        />
      </div>

      {/* Coordonnées */}
      <div>
        <label className="form-label">
          Coordonnées GPS <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder="Latitude (ex: 44.4582)"
            className="form-input flex-1 font-mono text-sm"
            type="number"
            step="any"
          />
          <input
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder="Longitude (ex: 6.7215)"
            className="form-input flex-1 font-mono text-sm"
            type="number"
            step="any"
          />
        </div>
        <button
          type="button"
          onClick={onRequestPickCoords}
          className="mt-2 flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0z" />
          </svg>
          Cliquer sur la carte pour placer le point
        </button>
      </div>

      {/* Email */}
      <div>
        <label className="form-label">Email de contact</label>
        <input
          name="email_contact"
          value={form.email_contact}
          onChange={handleChange}
          type="email"
          placeholder="votre@email.fr (optionnel)"
          className="form-input"
        />
      </div>

      {/* Photo */}
      <div>
        <label className="form-label">Photo</label>
        <div className="mt-1">
          {preview ? (
            <div className="relative group w-full h-36 rounded-lg overflow-hidden border border-stone-200">
              <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { setPhoto(null); setPreview(null) }}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity"
              >
                Changer la photo
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors">
              <svg className="w-8 h-8 text-stone-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-stone-500">Ajouter une photo (max 10 Mo)</span>
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-amber-700 hover:bg-amber-800 disabled:opacity-60 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Envoi en cours…
          </>
        ) : 'Soumettre le lieu'}
      </button>
    </form>
  )
}
