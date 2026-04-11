import { defineConfig } from 'vitepress'

const enNav = [
  { text: 'Guide', link: '/guide/getting-started' },
  { text: 'API', link: '/api/' },
  { text: 'Examples', link: '/examples/' },
]

const frNav = [
  { text: 'Guide', link: '/fr/guide/getting-started' },
  { text: 'API', link: '/fr/api/' },
  { text: 'Exemples', link: '/fr/examples/' },
]

const enSidebar = [
  {
    text: 'Guide',
    items: [{ text: 'Getting Started', link: '/guide/getting-started' }],
  },
  {
    text: 'API',
    items: [{ text: 'Reference', link: '/api/' }],
  },
  {
    text: 'Examples',
    items: [{ text: 'Usage Examples', link: '/examples/' }],
  },
]

const frSidebar = [
  {
    text: 'Guide',
    items: [{ text: 'Démarrage', link: '/fr/guide/getting-started' }],
  },
  {
    text: 'API',
    items: [{ text: 'Référence', link: '/fr/api/' }],
  },
  {
    text: 'Exemples',
    items: [{ text: "Exemples d'usage", link: '/fr/examples/' }],
  },
]

export default defineConfig({
  base: '/camera3D/',

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'camera3d',
      description: '3D camera plugin for the GWEN game engine',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
      },
    },
    fr: {
      label: 'Français',
      lang: 'fr-FR',
      title: 'camera3d',
      description: 'Plugin caméra 3D pour le moteur de jeu GWEN',
      themeConfig: {
        nav: frNav,
        sidebar: frSidebar,
      },
    },
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/gwenjs/camera3D' },
    ],
  },
})
