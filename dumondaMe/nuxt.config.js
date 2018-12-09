const path = require('path');
const nodeExternals = require('webpack-node-externals');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
    head: {
        title: 'DumondaMe',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
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
        ]
    },
    env: {
        staticUrl: process.env.CLIENT_STATIC_URL
    },
    router: {
        scrollBehavior: function () {
            return {x: 0, y: 0}
        }
    },
    modules: [
        '@nuxtjs/proxy',
        '@nuxtjs/axios',
        ['nuxt-matomo', {matomoUrl: process.env.MATOMO_URL, siteId: process.env.MATOMO_SIDE_ID}],
        '@nuxtjs/style-resources'
    ],
    /*sassResources: [
        path.resolve(__dirname, 'assets/style/variables.scss'),
        path.resolve(__dirname, 'assets/style/card.scss'),
        path.resolve(__dirname, 'assets/style/layout.scss')
    ],*/
    styleResources: {
        scss: [path.resolve(__dirname, 'assets/style/variables.scss'),
            path.resolve(__dirname, 'assets/style/card.scss'),
            path.resolve(__dirname, 'assets/style/layout.scss')]
    },
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
    build: {
        transpile: [/^vuetify/],
        plugins: [
            new VuetifyLoaderPlugin()
        ],
        extractCSS: true,

        extend(config) {
            if (process.server) {
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
        '~/plugins/axios.js'],
    css: [
        '~/assets/style/app.styl',
        'cropperjs/dist/cropper.min.css',
        '@mdi/font/css/materialdesignicons.min.css'
    ]
};
