import { getCollection, type CollectionEntry } from 'astro:content';
import { generateOGImage } from '../../../utils/og';

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
	const { title, description, date, lang } = post.data;
	const link = 'juzraai.github.io/blog';
	return generateOGImage({ title, description, link, date, lang });
}
