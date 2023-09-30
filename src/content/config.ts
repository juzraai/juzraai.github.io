import { defineCollection, z } from 'astro:content';

const langSchema = z.enum(['en_US', 'hu_HU']);
export type Lang = z.infer<typeof langSchema>;

const postsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		date: z.date(),
		description: z.string(),
		lang: langSchema,
		title: z.string(),
		tags: z.string(),
	}),
});

export const collections = {
	posts: postsCollection,
};
