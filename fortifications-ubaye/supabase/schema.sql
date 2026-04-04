-- ============================================================
-- Fortifications de la Vallée de l'Ubaye – Schéma Supabase
-- ============================================================

-- 1. Table principale des lieux
-- ============================================================
create table if not exists public.locations (
  id            uuid primary key default gen_random_uuid(),
  nom           text not null,
  type          text not null check (type in (
                  'Fort', 'Ouvrage', 'Baraquement', 'Blockhaus',
                  'Batterie', 'Casemate', 'Tour', 'Redoute', 'Autre'
                )),
  description   text,
  latitude      double precision not null,
  longitude     double precision not null,
  email_contact text,
  photo_url     text,
  statut        text not null default 'pending'
                  check (statut in ('pending', 'approved', 'rejected')),
  created_at    timestamptz not null default now()
);

-- Index pour filtrer rapidement par statut
create index if not exists locations_statut_idx on public.locations (statut);

-- 2. Row Level Security
-- ============================================================
alter table public.locations enable row level security;

-- Lecture : tout le monde peut voir les lieux approuvés
create policy "Lieux approuvés visibles par tous"
  on public.locations
  for select
  using (statut = 'approved');

-- Lecture admin : les utilisateurs authentifiés voient tout
create policy "Admins voient tout"
  on public.locations
  for select
  to authenticated
  using (true);

-- Insertion publique (soumission de formulaire)
create policy "Soumission publique"
  on public.locations
  for insert
  with check (statut = 'pending');

-- Mise à jour : réservée aux admins authentifiés (modération)
create policy "Modération réservée aux admins"
  on public.locations
  for update
  to authenticated
  using (true)
  with check (true);

-- Suppression : réservée aux admins
create policy "Suppression réservée aux admins"
  on public.locations
  for delete
  to authenticated
  using (true);

-- 3. Storage bucket pour les photos
-- ============================================================
-- À exécuter dans le dashboard Supabase → Storage → New bucket
-- Nom : "photos", public : true
--
-- Ou via SQL (API storage) :
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Politique : upload public (soumissions)
create policy "Upload public photos"
  on storage.objects
  for insert
  with check (bucket_id = 'photos');

-- Politique : lecture publique des photos
create policy "Lecture publique photos"
  on storage.objects
  for select
  using (bucket_id = 'photos');

-- Politique : suppression par admins
create policy "Suppression photos par admins"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'photos');

-- 4. Données de démonstration (optionnel)
-- ============================================================
insert into public.locations (nom, type, description, latitude, longitude, statut)
values
  (
    'Fort de Tournoux',
    'Fort',
    'Imposant ouvrage militaire construit entre 1843 et 1866, perché à 1 570 m d''altitude sur les hauteurs de la commune de La Condamine-Châtelard. L''un des forts les mieux conservés des Alpes du Sud.',
    44.4582, 6.7215,
    'approved'
  ),
  (
    'Fort de Roche-la-Croix',
    'Fort',
    'Ouvrage militaire du XIXe siècle surplombant le village de La Condamine-Châtelard. Partie intégrante du système défensif Séré de Rivières dans la haute vallée de l''Ubaye.',
    44.4601, 6.7180,
    'approved'
  ),
  (
    'Ouvrage du Restefond',
    'Ouvrage',
    'Ouvrage de la ligne Maginot des Alpes, construit dans les années 1930 à plus de 2 600 m d''altitude, près du col de la Bonette. Il contrôlait l''accès par la route du col.',
    44.3250, 6.8020,
    'approved'
  ),
  (
    'Blockhaus de Larche',
    'Blockhaus',
    'Petit ouvrage défensif de la Seconde Guerre mondiale situé à proximité du col de Larche (1 991 m). Témoignage de la ligne de défense franco-italienne des années 1940.',
    44.3478, 6.8856,
    'approved'
  );
