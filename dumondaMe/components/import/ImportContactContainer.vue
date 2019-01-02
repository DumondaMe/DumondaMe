<template>
    <div class="import-source-container">
        <div class="import-source"
             @click="openOAuthImport(sendGMailImportRequest, oAuthGoogleClientUrl, googleParser)">
            <img :src="getImportUrl('gmail.png')"/>
        </div>
    </div>
</template>

<script>

    import oAuthWindow from './oAuthWindow';
    import parseGoogleOAuthUrl from './parseGoogleOAuthUrl';

    export default {
        data() {
            return {
                oAuthWindow: null, checkWindowInterval: null, googleParser: parseGoogleOAuthUrl,
                oAuthGoogleClientUrl: process.env.oAuthGoogleClientUrl
            }
        },
        methods: {
            getImportUrl(image) {
                return `${process.env.staticUrl}/img/import/${image}`;
            },
            openOAuthImport(sendImportRequest, oAuthUrl, parser) {
                if (this.oAuthWindow === null) {
                    let window = oAuthWindow.open(oAuthUrl,
                        async function (url) {
                            try {
                                if (typeof url === 'string') {
                                    let code = parser.parse(url);
                                    await sendImportRequest(code);
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        });
                    this.oAuthWindow = window.window;
                    this.checkWindowInterval = window.interval;
                }
            },
            async sendGMailImportRequest(code) {
                let response = await this.$axios.$get('import/contact/gmail', {params: {code}});
                this.addSourceToContacts(response.contacts, 'GMail');
                debugger
                this.$emit('contacts-loaded', response.contacts);
            },
            addSourceToContacts(contacts, source) {
                for (let contact of contacts) {
                    contact.source = source;
                }
            },
            closeOAuthWindow() {
                if (this.oAuthWindow && this.oAuthWindow.close) {
                    this.oAuthWindow.close();
                    this.oAuthWindow = null;
                }
                if (this.checkWindowInterval) {
                    clearInterval(this.checkWindowInterval);
                }
            }
        },
        beforeDestroy() {
            this.closeOAuthWindow();
        }
    }
</script>

<style lang="scss">
    .import-source-container {
        .import-source {
            display: inline-block;
            width: 40px;
            height: 40px;

            img {
                cursor: pointer;
                width: 100%;
            }
        }
    }
</style>
