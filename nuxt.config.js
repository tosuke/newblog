import dotenv from 'dotenv-safe'
dotenv.config()

const settings = {
  title: "Tosuke's blog",
  subtitle: '役に立(つ/たない)技術情報やポエム',
  siteName: 'tosukeblog'
}

export default {
  /*
  ** Headers of the page
  */
  head: {
    title: settings.title,
    titleTemplate: `%s | ${settings.title}`,
    htmlAttrs: {
      lang: 'ja',
      prefix:
        'og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: settings.subtitle },

      // OGP
      { property: 'og:site_name', content: settings.siteName },
      { property: 'og:locale', content: 'ja_JP' },
      {
        hid: 'og:title',
        property: 'og:title',
        content: `${settings.title} | ${settings.subtitle}`
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: `https://${process.env.HOST}`
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content: settings.subtitle
      },

      // Twitter
      { property: 'twitter:card', content: 'summary' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      // atom.xml
      {
        rel: 'alternate',
        type: 'application/atom+xml',
        title: settings.title,
        href: '/feed/atom.xml'
      }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },

  css: ['bulma', '~/assets/css/font.css'],

  env: {
    ...process.env,
    ...settings
  },

  /*
  ** Router configuration
  */
  router: {
    scrollBehavior(to, from, savedPosition) {
      let position = false

      if (to.matched.length < 2) {
        position = { x: 0, y: 0 }
      } else if (
        to.matched.some(r => r.components.default.options.scrollToTop)
      ) {
        position = { x: 0, y: 0 }
      }

      if (savedPosition) {
        position = savedPosition
      }

      return position
    }
  },

  /*
  ** Build configuration
  */
  build: {
    // cache: true,
    parallel: true,
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev }) {
      if (isDev && process.browser) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      // markdown as a vue component
      config.module.rules.push({
        test: /\.md$/,
        use: ['vue-loader', require.resolve('./utils/markdownLoader')]
      })
    }
  },

  generate: {
    routes: require('./posts.json').map(post => `/posts/${post.fields.slug}`),
    fallback: true
  }
}
