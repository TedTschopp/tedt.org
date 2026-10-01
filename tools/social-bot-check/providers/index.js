import { bluesky } from './bluesky.js';
import { mastodon } from './mastodon.js';

// Register a new provider here. Shared analysis and rendering use normalized data.
export const providers = new Map([bluesky, mastodon].map(provider => [provider.id, provider]));
