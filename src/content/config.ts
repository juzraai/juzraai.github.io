import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		date: z.date(),
		description: z.string(),
		lang: z.enum(['en_US', 'hu_HU']),
		title: z.string(),
		tags: z.string(),
	}),
});

export const collections = {
	posts: postsCollection,
};
