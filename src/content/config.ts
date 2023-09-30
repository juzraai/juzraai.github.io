import { z, defineCollection } from 'astro:content';

const postsCollection = defineCollection({
	type: 'content',
	schema: z.object({
		date: z.date(),
		description: z.string(),
		title: z.string(),
		tags: z.string(),
	}),
});

export const collections = {
	posts: postsCollection,
};
