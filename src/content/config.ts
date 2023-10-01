import { defineCollection, z } from 'astro:content';

const langSchema = z.enum(['en', 'hu']);
export type Lang = z.infer<typeof langSchema>;

const altLinksSchema = z.record(langSchema, z.string()).optional();
export type AltLinks = z.infer<typeof altLinksSchema>;

const blog = defineCollection({
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

const portfolio = defineCollection({
	type: 'data',
	schema: z.object({
		description: z.record(langSchema, z.string()),
		post: z.string().optional(),
		source: z.string().url().optional(),
		tags: z.string(),
		title: z.string(),
		url: z.string().url().optional(),
		year: z.number().min(2012),
	}),
});

// TODO tags should be an array instead of string (both collections)
// TODO (?) turn portfolio into content collection, move project posts

export const collections = {
	blog,
	portfolio,
};
