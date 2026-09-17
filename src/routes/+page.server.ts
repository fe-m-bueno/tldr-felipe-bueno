import { getHomeData } from '$lib/server/contentful';
import type { PageServerLoad } from './$types';

// Roda uma vez, no build. Nunca em runtime: a rota inteira é prerenderizada.
export const load: PageServerLoad = async () => await getHomeData();
