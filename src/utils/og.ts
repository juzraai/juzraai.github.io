/*
	Thank you Dzmitry Kozhukh! :)
	https://www.kozhuhds.com/blog/generating-static-open-graph-og-images-in-astro-using-vercel-og
*/
import fs from 'fs';
import path from 'path';
import { ImageResponse } from '@vercel/og';
import type { ReactElement } from 'react';
import type { Lang } from '../content/config';

type GenerateOGImageParams = {
	title: string;
	description: string;
	link: string;
	date?: Date;
	lang?: Lang;
};

export async function generateOGImage(params: GenerateOGImageParams) {
	const { title, description, link, date, lang } = params;

	const titleEl = el('div', 'mb-8 text-[60px] font-semibold text-zinc-800', title);
	const descEl = el('div', 'mb-12 text-zinc-600', description);

	const dateEl = date ? el('div', 'text-zinc-400', date.toLocaleDateString(lang)) : undefined;
	const linkEl = el('div', 'font-semibold text-blue-500', `${link} »`);
	const metaEl = el('div', 'flex justify-between mt-auto', [linkEl, dateEl]);
	const contentEl = el('div', 'flex flex-col w-full h-full', [titleEl, descEl, metaEl]);

	const html = {
		type: 'div',
		props: {
			tw: 'w-full h-full flex items-center justify-center p-20 text-[40px] bg-white',
			style: {
				fontFamily: 'Barlow',
			},
			children: contentEl,
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
