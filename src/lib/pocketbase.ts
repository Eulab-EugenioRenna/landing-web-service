import PocketBase from 'pocketbase';

export const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || process.env.POCKETBASE_URL);

// Disable auto cancellation to avoid issues in Next.js server components/actions
pb.autoCancellation(false);

export const getCollectionName = () => process.env.POCKETBASE_COLLECTION || 'eulab_web_lead';
