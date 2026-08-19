export type HomeLayerLocale = 'ru' | 'en' | 'zh';

export type HomeLayerNode = {
  id: string;
  type: 'frame' | 'section' | 'group' | 'text' | 'component';
  name: string;
  tag?: string;
  children?: HomeLayerNode[];
};

const labels = {
  ru: { final: 'Главная — финал', mobile: 'Главная — mobile' },
  en: { final: 'Home — final', mobile: 'Home — mobile' },
  zh: { final: '首页 — 完成版', mobile: '首页 — 移动端' },
} as const;

export function createHomeLayerTrees(locale: HomeLayerLocale) {
  const copy = labels[locale];
  const beforeTree: HomeLayerNode[] = [
    {
      id: 'home-final', type: 'frame', name: copy.final, children: [
        {
          id: 'frame-42', type: 'frame', name: 'Frame 42', children: [
            {
              id: 'group-18', type: 'group', name: 'Group 18', children: [
                { id: 'heading', type: 'text', name: 'Heading' },
                { id: 'text', type: 'text', name: 'Text' },
              ],
            },
            { id: 'button', type: 'component', name: 'Button' },
          ],
        },
      ],
    },
    {
      id: 'home-mobile', type: 'frame', name: copy.mobile, children: [
        {
          id: 'group-91', type: 'group', name: 'Group 91', children: [
            { id: 'title-mobile', type: 'text', name: 'Title mobile' },
            { id: 'button-copy', type: 'component', name: 'Button copy' },
          ],
        },
      ],
    },
  ];

  const afterTree: HomeLayerNode[] = [1440, 375].map((breakpoint) => ({
    id: `home-${breakpoint}`,
    type: 'frame',
    name: `${locale === 'zh' ? '首页' : locale === 'ru' ? 'Главная' : 'Home'} · ${breakpoint}`,
    tag: `[page=home] [bp=${breakpoint}] [view=default]`,
    children: [
      {
        id: `home-hero-${breakpoint}`,
        type: 'section',
        name: 'home-hero',
        tag: '[section=home-hero]',
        children: [
          {
            id: `hero-copy-${breakpoint}`,
            type: 'frame',
            name: 'hero-copy',
            children: [{ id: `hero-title-${breakpoint}`, type: 'text', name: 'hero-title' }],
          },
          {
            id: `contact-button-${breakpoint}`,
            type: 'component',
            name: 'contact-button',
            tag: '[action=modal:contact-modal]',
          },
        ],
      },
      {
        id: `contact-modal-${breakpoint}`,
        type: 'frame',
        name: 'contact-modal',
        tag: '[modal=contact-modal]',
      },
    ],
  }));

  return { beforeTree, afterTree };
}
