/*
	Thank you Dzmitry Kozhukh! :)
	https://www.kozhuhds.com/blog/generating-static-open-graph-og-images-in-astro-using-vercel-og
*/

import { getCollection, type CollectionEntry } from 'astro:content';
import fs from 'fs';
import path from 'path';
import { ImageResponse } from '@vercel/og';
import type { ReactElement } from 'react';

export async function getStaticPaths() {
	const blogPosts = await getCollection('blog');
	return blogPosts.map((post) => ({
		params: { slug: post.slug },
		props: { post },
	}));
}

type Props = {
	params: { slug: string };
	props: { post: CollectionEntry<'blog'> };
};

export async function GET({ props }: Props) {
	const { post } = props;

	const title = el('div', 'mb-8 text-[64px] font-semibold text-zinc-800', post.data.title);
	const description = el('div', 'mb-12 text-zinc-600', post.data.description);

	const date = el('div', 'text-zinc-400', post.data.date.toLocaleDateString(post.data.lang));
	const link = el('div', 'font-semibold text-blue-500', 'juzraai.github.io/blog »');
	const meta = el('div', 'flex justify-between', [link, date]);
	const content = el('div', 'flex flex-col', [title, description, meta]);

	const html = {
		type: 'div',
		props: {
			tw: 'w-full h-full flex items-center justify-center p-24 text-[42px] bg-white',
			style: {
				fontFamily: 'Barlow',
			},
			children: content,
		},
	};

	const BarlowRegular = fs.readFileSync(path.resolve('./fonts/Barlow-Regular.ttf'));
	const BarlowSemibold = fs.readFileSync(path.resolve('./fonts/Barlow-SemiBold.ttf'));

	return new ImageResponse(html, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'Barlow',
				data: BarlowRegular.buffer,
				style: 'normal',
				weight: 400,
			},
			{
				name: 'Barlow',
				data: BarlowSemibold.buffer,
				style: 'normal',
				weight: 600,
			},
		],
	});
}

function el(name: string, classes: string, children: ReactElement): ReactElement {
	return {
		type: name,
		props: { tw: classes, children },
	};
}
