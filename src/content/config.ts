import { defineCollection, z } from 'astro:content';

const langSchema = z.enum(['en', 'hu']);
export type Lang = z.infer<typeof langSchema>;

const altLinksSchema = z.record(langSchema, z.string()).optional();
export type AltLinks = z.infer<typeof altLinksSchema>;

const postsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		alt: altLinksSchema,
		date: z.date(),
		description: z.string(),
		image: z.string().optional(),
		lang: langSchema,
		title: z.string(),
		tags: z.string(),
	}),
});

export const collections = {
	posts: postsCollection,
};
