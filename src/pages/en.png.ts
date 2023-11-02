import { generateOGImage } from '../utils/og';

export async function GET() {
	// TODO (later) should import text
	return generateOGImage({
		title: "I'm Zsolt, a full-stack developer.",
		description: "I've been developing crawlers and webapps for 11+ years.",
		link: 'juzraai.github.io/en',
	});
}
