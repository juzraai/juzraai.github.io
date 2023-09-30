import compress from 'astro-compress';
import robots from 'astro-robots-txt';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [compress({ Logger: 0 }), robots(), sitemap(), tailwind()],
	site: 'https://juzraai.github.io',
});
