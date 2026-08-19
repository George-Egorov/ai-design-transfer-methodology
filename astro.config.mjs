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
      title: { ru: 'BRIDGE', en: 'BRIDGE', zh: 'BRIDGE' },
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
        zh: { label: '中文', lang: 'zh-CN' },
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
          translations: { en: 'Start', zh: '开始' },
          items: [
            { slug: 'start/designer-quick-start' },
            { slug: 'examples' },
            { slug: 'check' },
          ],
        },
        {
          label: 'Подготовить макет',
          translations: { en: 'Prepare a design', zh: '准备设计' },
          items: [
            { slug: 'guides/design-rules' },
            { slug: 'guides/layer-naming-and-identity' },
            { slug: 'guides/responsive-breakpoints' },
            { slug: 'guides/interactions-and-targets' },
            { slug: 'guides/components-and-ui-kit' },
            { slug: 'guides/height-and-overflow' },
          ],
        },
        {
          label: 'Расширенные сценарии',
          translations: { en: 'Advanced topics', zh: '进阶主题' },
          collapsed: true,
          items: [
            { slug: 'guides/data-and-visualization' },
            { slug: 'guides/state-machines-and-reactions' },
            { slug: 'guides/motion-and-scroll' },
            { slug: 'reference/accessibility-profile' },
          ],
        },
        {
          label: 'Проверка качества',
          translations: { en: 'Quality checks', zh: '质量检查' },
          collapsed: true,
          items: [
            { slug: 'check/designer-checklist' },
            { slug: 'quality/common-designer-mistakes' },
            { slug: 'quality/hard-cases-and-edge-cases' },
            { slug: 'check/full-review' },
          ],
        },
        {
          label: 'Справочник',
          translations: { en: 'Reference', zh: '参考资料' },
          collapsed: true,
          items: [{ slug: 'tags' }, { slug: 'rules' }, { autogenerate: { directory: 'reference' } }],
        },
        {
          label: 'Команда и проект',
          translations: { en: 'Team and project', zh: '团队与项目' },
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
        locales: { ru: 'ru', en: 'en', zh: 'zh-CN' },
      },
    }),
  ],
});
