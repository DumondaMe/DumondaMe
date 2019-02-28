const path = require('path');
const nodeExternals = require('webpack-node-externals');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

const getScripts = function () {
    let script = [{src: `${process.env.CLIENT_STATIC_URL}/polyfill.min.js`}];
    if (process.env.NODE_ENV === 'production') {
        script.push({
            src: `https://www.googletagmanager.com/gtag/js?id=AW-773868544`, async: true
        });
        script.push({
            innerHTML: "window.dataLayer = window.dataLayer || []; " +
                "function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'AW-773868544');"
        });
    }
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
            {rel: 'icon', type: 'image/x-icon', href: `${process.env.CLIENT_STATIC_URL}/favicon.ico`},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500'}
        ],
        script: getScripts(),
        __dangerouslyDisableSanitizers: ['script']
    },
    dev: (process.env.NODE_ENV !== 'production'),
    env: {
        staticUrl: process.env.CLIENT_STATIC_URL,
        domainUrl: process.env.DUMONDA_ME_DOMAIN,
        isProduction: process.env.NODE_ENV === 'production',
        oAuthGoogleClientUrl: process.env.OAUTH_GOOGLE_CLIENT_URL,
        oAuthOutlookClientUrl: process.env.OAUTH_OUTLOOK_CLIENT_URL
    },
    router: {
        scrollBehavior: function () {
            return {x: 0, y: 0}
        }
    },
    modules: [
        ['@nuxtjs/pwa', {meta: false, oneSignal: false}],
        '@nuxtjs/proxy',
        '@nuxtjs/axios',
        ['nuxt-matomo', {matomoUrl: process.env.MATOMO_URL, siteId: process.env.MATOMO_SIDE_ID}],
        'nuxt-sass-resources-loader'
    ],
    sassResources: [
        path.resolve(__dirname, 'assets/style/variables.scss'),
        path.resolve(__dirname, 'assets/style/card.scss'),
        path.resolve(__dirname, 'assets/style/layout.scss')
    ],
    loading: {
        color: '#009e97'
    },
    transition: {
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
        transpile: [/^vuetify/],
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
        {src: '~/plugins/vue-lazyload', ssr: false}],
    css: [
        '~/assets/style/app.styl',
        'cropperjs/dist/cropper.min.css',
        '@mdi/font/css/materialdesignicons.min.css'
    ]
};
