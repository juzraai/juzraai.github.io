import { generateOGImage } from '../utils/og';

export async function GET() {
	// TODO should import text
	return generateOGImage({
		title: 'Zsolt vagyok, full-stack fejlesztő.',
		description: '11+ éve készítek crawlereket és webalkalmazásokat.',
		link: 'juzraai.github.io',
	});
}
