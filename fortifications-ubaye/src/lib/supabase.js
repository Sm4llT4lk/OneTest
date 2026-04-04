import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Variables Supabase manquantes. Copiez .env.example en .env et renseignez vos clés.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder'
)

// ── Helpers ──────────────────────────────────────────────────

export async function fetchApprovedLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('statut', 'approved')
    .order('nom')
  if (error) throw error
  return data
}

export async function fetchPendingLocations() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('statut', 'pending')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function submitLocation(payload) {
  const { data, error } = await supabase
    .from('locations')
    .insert([{ ...payload, statut: 'pending' }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateLocationStatus(id, statut) {
  const { error } = await supabase
    .from('locations')
    .update({ statut })
    .eq('id', id)
  if (error) throw error
}

export async function uploadPhoto(file) {
  const ext = file.name.split('.').pop()
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage
    .from('photos')
    .upload(filename, file, { cacheControl: '3600', upsert: false })
  if (error) throw error
  const { data } = supabase.storage.from('photos').getPublicUrl(filename)
  return data.publicUrl
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })
}
