// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

const base = process.env.SITE_BASE || '/bridge-design-methodology';
const canonicalRoot = `https://poliklot.github.io${base === '/' ? '/' : `${base.replace(/\/$/u, '')}/`}`;

export default defineConfig({
  site: 'https://poliklot.github.io',
  base,
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: { ru: 'BRIDGE', en: 'BRIDGE' },
      description:
        'BRIDGE is a methodology for interface designs that can be implemented without guesswork.',
      logo: {
        light: '/assets/brand/bridge-lockup-light.svg',
        dark: '/assets/brand/bridge-lockup-dark.svg',
        alt: 'BRIDGE',
        replacesTitle: true,
      },
      favicon: '/assets/brand/bridge-mark.svg',
      defaultLocale: 'ru',
      locales: {
        ru: { label: 'Русский', lang: 'ru' },
        en: { label: 'English', lang: 'en' },
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Poliklot/bridge-design-methodology',
        },
      ],
      customCss: ['/src/styles/bridge.css'],
      components: {
        Header: './src/components/BridgeHeader.astro',
        MobileMenuToggle: './src/components/AccessibleMobileMenuToggle.astro',
        SocialIcons: './src/components/ExternalSocialIcons.astro',
        ThemeSelect: './src/components/BridgeThemeSelect.astro',
        LanguageSelect: './src/components/BridgeLanguageSelect.astro',
        PageTitle: './src/components/BridgePageTitle.astro',
        Footer: './src/components/BridgeFooter.astro',
      },
      lastUpdated: false,
      credits: false,
      disable404Route: true,
      pagefind: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      head: [
        { tag: 'meta', attrs: { name: 'theme-color', content: '#1E1E1E' } },
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: `https://poliklot.github.io${base}/assets/brand/social-preview-1280x640.png`,
          },
        },
      ],
      sidebar: [
        {
          label: 'Начать',
          translations: { en: 'Start' },
          items: [
            { slug: 'start/designer-quick-start' },
            { slug: 'examples' },
            { slug: 'check' },
          ],
        },
        {
          label: 'Основные правила',
          translations: { en: 'Core rules' },
          items: [{ autogenerate: { directory: 'guides' } }],
        },
        {
          label: 'Проверка качества',
          translations: { en: 'Quality checks' },
          items: [{ autogenerate: { directory: 'quality' } }],
        },
        {
          label: 'Справочник',
          translations: { en: 'Reference' },
          items: [{ slug: 'tags' }, { slug: 'rules' }, { autogenerate: { directory: 'reference' } }],
        },
        {
          label: 'Проект',
          translations: { en: 'Project' },
          collapsed: true,
          items: [{ autogenerate: { directory: 'project' } }],
        },
      ],
    }),
    sitemap({
      // The unlocalized root is a noindex redirect to Russian. Publishing it as
      // the default Russian URL produces a duplicate hreflang alongside /ru/.
      filter: (page) => page !== canonicalRoot,
      i18n: {
        defaultLocale: 'ru',
        locales: { ru: 'ru', en: 'en' },
      },
    }),
  ],
});
