const path = require('path');
const nodeExternals = require('webpack-node-externals');
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin');

module.exports = {
    head: {
        title: 'DumondaMe Admin',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'DumondaMe Admin'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: `${process.env.CLIENT_STATIC_URL}/favicon.ico`},
            {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons'}
        ]
    },
    env: {
        staticUrl: process.env.CLIENT_STATIC_URL
    },
    axios: {
        prefix: '/api/',
        proxy: true
    },
    modules: [
        '@nuxtjs/proxy',
        '@nuxtjs/axios',
        'nuxt-sass-resources-loader'
    ],
    sassResources: [
        path.resolve(__dirname, 'assets/style/variables.scss'),
        path.resolve(__dirname, 'assets/style/layout.scss')
    ],
    loading: false,
    transition: {
        name: 'page',
        mode: 'out-in',
        css: false,
        duration: 0
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
        '~/plugins/vuetify.js'],
    css: [
        '~/assets/style/app.styl',
        '@mdi/font/css/materialdesignicons.min.css'
    ]
};
