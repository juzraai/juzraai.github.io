import fs from 'fs';
import path from 'path';
import { ImageResponse } from '@vercel/og';

export async function GET() {
	const html = {
		type: 'div',
		props: {
			tw: 'w-full h-full flex items-center justify-center p-20 text-[480px] font-semibold bg-white text-zinc-800',
			style: {
				fontFamily: 'BarlowCondensed',
			},
			children: ['Zs'],
		},
	};

	const BarlowCondensedSemibold = fs.readFileSync(
		path.resolve('./fonts/BarlowCondensed-SemiBold.ttf'),
	);

	return new ImageResponse(html, {
		width: 512,
		height: 512,
		fonts: [
			{
				name: 'BarlowCondensed',
				data: BarlowCondensedSemibold.buffer,
				style: 'normal',
				weight: 600,
			},
		],
	});
}
