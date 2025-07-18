import { defineCollection, z } from 'astro:content';

const langSchema = z.enum(['en', 'hu']);
export type Lang = z.infer<typeof langSchema>;
export const locales: Record<Lang, string> = {
	hu: 'hu_HU',
	en: 'en_US',
};

const altLinksSchema = z.record(langSchema, z.string()).optional();
export type AltLinks = z.infer<typeof altLinksSchema>;

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		alt: altLinksSchema,
		date: z.date(),
		description: z.string(),
		lang: langSchema,
		title: z.string(),
		tags: z.string(),
	}),
});
export const blogTitle: Record<Lang, string> = {
	en: 'Notes',
	hu: 'Jegyzeteim',
};

const portfolio = defineCollection({
	type: 'data',
	schema: z.object({
		description: z.record(langSchema, z.string()),
		post: z.record(langSchema, z.string()).optional(),
		source: z.string().url().optional(),
		tags: z.string(),
		title: z.string(),
		url: z.string().url().optional(),
		year: z.number().min(2012),
	}),
});
export const portfolioTitle: Record<Lang, string> = {
	en: 'Projects',
	hu: 'Munkáim',
};
export const portfolioPostLinkLabel: Record<Lang, string> = {
	en: 'Read more',
	hu: 'Bővebben',
};

// TODO (later) tags should be an array instead of string (both collections)

export const collections = {
	blog,
	portfolio,
};

export const referenceYear = 2012;
