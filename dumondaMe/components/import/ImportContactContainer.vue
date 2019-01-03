<template>
    <div class="import-source-container">
        <div class="import-source"
             @click="openOAuthImport(sendGMailImportRequest, oAuthGoogleClientUrl, googleParser)">
            <img :src="getImportUrl('gmail.png')"/>
        </div>
        <div class="import-source"
             @click="openOAuthImport(sendOutlookImportRequest, oAuthOutlookClientUrl, outlookParser)">
            <img :src="getImportUrl('outlook.png')"/>
        </div>
    </div>
</template>

<script>

    import oAuthWindow from './oAuthWindow';
    import parseGoogleOAuthUrl from './parseGoogleOAuthUrl';
    import parseOutlookOAuthUrl from './parseOutlookOAuthUrl';

    export default {
        data() {
            return {
                oAuthWindow: null, checkWindowInterval: null, googleParser: parseGoogleOAuthUrl,
                oAuthGoogleClientUrl: process.env.oAuthGoogleClientUrl,
                oAuthOutlookClientUrl: process.env.oAuthOutlookClientUrl, outlookParser: parseOutlookOAuthUrl
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
                                    debugger
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
                this.$emit('contacts-loaded', response.contacts);
            },
            async sendOutlookImportRequest(code) {
                let response = await this.$axios.$get('import/contact/outlook', {params: {code}});
                this.addSourceToContacts(response.contacts, 'Outlook');
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
            margin-right: 18px;

            img {
                cursor: pointer;
                width: 100%;
            }
        }
    }
</style>
