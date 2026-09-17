import { getProjectRows } from '$lib/server/contentful';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => ({ projects: await getProjectRows() });
