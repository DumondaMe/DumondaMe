const nodeExternals = require('webpack-node-externals');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const getScripts = function () {
    let script = [];
    script.push({
        innerHTML: "if(!(window.Promise && window.fetch && window.Symbol)) {" +
            `document.write("<script language='javascript' type='text/javascript' src='${process.env.CLIENT_STATIC_URL}/polyfill.7.6.min.js'><\/scr" + "ipt>");}`
    });
    return script;
};

module.exports = {
    head: {
        title: 'DumondaMe',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'mobile-web-app-capable', name: 'mobile-web-app-capable', content: 'yes'},
            {hid: 'apple-mobile-web-app-capable', name: 'apple-mobile-web-app-capable', content: 'yes'},
            {
                hid: 'apple-mobile-web-app-status-bar-style', name: 'apple-mobile-web-app-status-bar-style',
                content: 'default'
            },
            {hid: 'theme-color', name: 'theme-color', content: '#009e97'},
            {hid: 'og:type', property: 'og:type', content: 'website'},
            {hid: 'og:url', property: 'og:url', content: 'https://www.dumonda.me/'},
            {hid: 'og:site_name', property: 'og:site_name', content: 'Dumonda Me'},
            {
                hid: 'og:image', property: 'og:image',
                content: `${process.env.CLIENT_STATIC_URL}/img/socialMedia/preview.jpg`
            },
            {hid: 'twitter:card', property: 'twitter:card', content: 'summary'},
            {hid: 'twitter:url', property: 'twitter:url', content: 'https://www.dumonda.me/'},
            {
                hid: 'twitter:image', property: 'twitter:image',
                content: `${process.env.CLIENT_STATIC_URL}/img/socialMedia/preview.jpg`
            }
        ],
        noscript: [{innerHTML: "This website requires JavaScript", body: true}],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: `${process.env.CLIENT_STATIC_URL}/favicon.ico`}
        ],
        script: getScripts(),
        __dangerouslyDisableSanitizers: ['script']
    },
    dev: (process.env.NODE_ENV !== 'production'),
    modern: process.env.NODE_ENV === 'production' ? 'client' : false,
    env: {
        staticUrl: process.env.CLIENT_STATIC_URL,
        domainUrl: process.env.DUMONDA_ME_DOMAIN,
        isProduction: process.env.NODE_ENV === 'production',
        oAuthGoogleClientUrl: process.env.OAUTH_GOOGLE_CLIENT_URL,
        oAuthOutlookClientUrl: process.env.OAUTH_OUTLOOK_CLIENT_URL
    },
    modules: [
        ['@nuxtjs/pwa', {meta: false, oneSignal: false}],
        '@nuxtjs/proxy',
        '@nuxtjs/axios',
        ['nuxt-matomo', {matomoUrl: process.env.MATOMO_URL, siteId: process.env.MATOMO_SIDE_ID}],
        '@nuxtjs/style-resources',
        'nuxt-webfontloader'
    ],
    styleResources: {
        scss: ['~assets/style/_variables.scss', '~assets/style/_mixins.scss']
    },
    webfontloader: {
        google: {
            families: ['Roboto:300,400,500'] //Loads Lato font with weights 400 and 700
        }
    },
    loading: {
        color: '#4CAF50'
    },
    pageTransition: {
        name: 'page',
        mode: 'out-in',
        css: false,
        duration: 0
    },
    axios: {
        prefix: '/api/',
        proxy: true
    },
    render: {
        resourceHints: false
    },
    manifest: {
        name: 'DumondaMe',
        "short_name": 'DumondaMe',
        lang: 'de',
        "start_url": '/',
        display: 'standalone'
    },
    build: {
        transpile: ['vuetify/lib'],
        plugins: [
            new VuetifyLoaderPlugin()
        ],
        optimizeCSS: true,
        extend(config, {isServer}) {
            if (isServer) {
                config.externals = [
                    nodeExternals({
                        whitelist: [/^vuetify/]
                    })
                ]
            }
        }
    },
    plugins: ['~/plugins/i18n.js',
        '~/plugins/moment.js',
        '~/plugins/vuetify.js',
        '~/plugins/axios.js',
        '~/plugins/route.js',
        {src: '~/plugins/vue-lazyload', ssr: false},
        {src: '~/plugins/intersection-observer', ssr: false},],
    css: [
        '~/assets/style/card.scss',
        '~/assets/style/layout.scss',
        'cropperjs/dist/cropper.min.css'
    ]
};
