import { getSupabaseClient } from './supabaseClient';

function throwIfError({ data, error }) {
  if (error) throw error;
  return data;
}

export async function listFeaturedProviders() {
  return throwIfError(await getSupabaseClient().from('providers').select('*').eq('featured', true).order('rating', { ascending: false }).limit(6));
}

export async function listProviders() {
  return throwIfError(await getSupabaseClient().from('providers').select('*').order('rating', { ascending: false }));
}

export async function getProvider(id) {
  return throwIfError(await getSupabaseClient().from('providers').select('*').eq('id', id).maybeSingle());
}

export async function listProviderReviews(providerId) {
  return throwIfError(await getSupabaseClient().from('reviews_public').select('*').eq('provider_id', providerId).order('created_date', { ascending: false }));
}

export async function getProviderStats() {
  const client = getSupabaseClient();
  const [providerResult, reviewResult, ratingsResult] = await Promise.all([
    client.from('providers').select('id', { count: 'exact', head: true }),
    client.from('reviews_public').select('id', { count: 'exact', head: true }),
    client.from('providers').select('rating').gt('rating', 0),
  ]);
  for (const result of [providerResult, reviewResult, ratingsResult]) if (result.error) throw result.error;
  const ratings = ratingsResult.data || [];
  const avgRating = ratings.length ? (ratings.reduce((sum, row) => sum + Number(row.rating || 0), 0) / ratings.length).toFixed(1) : '5.0';
  return { totalProviders: providerResult.count || 0, totalReviews: reviewResult.count || 0, avgRating };
}

export async function createBooking(booking) {
  return throwIfError(await getSupabaseClient().from('bookings').insert(booking));
}

export async function createReview(review) {
  return throwIfError(await getSupabaseClient().from('reviews').insert(review));
}
