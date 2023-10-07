const colors = require('tailwindcss/colors');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				gray: colors.zinc,
			},
			fontFamily: {
				sans: ['"Barlow"', ...fontFamily.sans],
				narrow: ['"Barlow Condensed"', ...fontFamily.sans],
			},
			typography: ({ theme }) => ({
				custom: {
					css: {
						'--tw-prose-body': theme('colors.gray[800]'),
						'--tw-prose-headings': theme('colors.gray[900]'),
						'--tw-prose-lead': theme('colors.gray[700]'),
						'--tw-prose-links': theme('colors.gray[900]'),
						'--tw-prose-bold': theme('colors.gray[900]'),
						'--tw-prose-counters': theme('colors.gray[600]'),
						'--tw-prose-bullets': theme('colors.gray[400]'),
						'--tw-prose-hr': theme('colors.gray[300]'),
						'--tw-prose-quotes': theme('colors.gray[900]'),
						'--tw-prose-quote-borders': theme('colors.gray[300]'),
						'--tw-prose-captions': theme('colors.gray[700]'),
						'--tw-prose-code': theme('colors.gray[900]'),
						'--tw-prose-pre-code': theme('colors.gray[100]'),
						'--tw-prose-pre-bg': theme('colors.gray[900]'),
						'--tw-prose-th-borders': theme('colors.gray[300]'),
						'--tw-prose-td-borders': theme('colors.gray[200]'),
						'--tw-prose-invert-body': theme('colors.gray[200]'),
						'--tw-prose-invert-headings': theme('colors.white'),
						'--tw-prose-invert-lead': theme('colors.gray[300]'),
						'--tw-prose-invert-links': theme('colors.white'),
						'--tw-prose-invert-bold': theme('colors.white'),
						'--tw-prose-invert-counters': theme('colors.gray[400]'),
						'--tw-prose-invert-bullets': theme('colors.gray[600]'),
						'--tw-prose-invert-hr': theme('colors.gray[700]'),
						'--tw-prose-invert-quotes': theme('colors.gray[100]'),
						'--tw-prose-invert-quote-borders': theme('colors.gray[700]'),
						'--tw-prose-invert-captions': theme('colors.gray[400]'),
						'--tw-prose-invert-code': theme('colors.white'),
						'--tw-prose-invert-pre-code': theme('colors.gray[300]'),
						'--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
						'--tw-prose-invert-th-borders': theme('colors.gray[600]'),
						'--tw-prose-invert-td-borders': theme('colors.gray[700]'),
					},
				},
			}),
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
