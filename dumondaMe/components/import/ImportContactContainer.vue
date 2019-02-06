<template>
    <div class="import-source-container">
        <div class="import-source-description" v-if="!contactExist">
            {{$t('dialog:invite:importSourceDescription')}}
        </div>
        <div class="import-source-inner-container">
            <v-layout row wrap>
                <v-flex xs12 sm4 md3>
                    <div class="import-source"
                         @click="openOAuthImport(sendGMailImportRequest, oAuthGoogleClientUrl, googleParser)">
                        <div class="import-source-image">
                            <img :src="getImportUrl('gmail.png')"/>
                        </div>
                        <div class="import-source-element-description">Gmail</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4 md3>
                    <div class="import-source"
                         @click="openOAuthImport(sendOutlookImportRequest, oAuthOutlookClientUrl, outlookParser)">
                        <div class="import-source-image">
                            <img :src="getImportUrl('outlook.png')"/>
                        </div>
                        <div class="import-source-element-description">Outlook</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4 md3>
                    <div class="import-source" @click="$emit('show-basic-auth-gmx')">
                        <div class="import-source-image">
                            <img :src="getImportUrl('gmx.png')"/>
                        </div>
                        <div class="import-source-element-description">GMX</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4 md3>
                    <div class="import-source" @click="$emit('show-basic-auth-webde')">
                        <div class="import-source-image">
                            <img :src="getImportUrl('webde.png')"/>
                        </div>
                        <div class="import-source-element-description">WEB.DE</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm6 md6>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<script>

    import oAuthWindow from './oAuthWindow';
    import parseGoogleOAuthUrl from './parseGoogleOAuthUrl';
    import parseOutlookOAuthUrl from './parseOutlookOAuthUrl';

    export default {
        props: ['contactExist'],
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
                    let closeOAuthWindow = this.closeOAuthWindow;
                    let window = oAuthWindow.open(oAuthUrl,
                        async function (url) {
                            try {
                                if (typeof url === 'string') {
                                    let code = parser.parse(url);
                                    await sendImportRequest(code);
                                }
                            } catch (e) {
                                console.error(e);
                            } finally {
                                closeOAuthWindow();
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
                } else {
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
        .import-source-description {
            font-size: 16px;
            font-weight: 300;
            margin-bottom: 18px;
        }

        .import-source-inner-container {

            .import-source {
                margin-bottom: 18px;
                display: flex;

                .import-source-image {
                    width: 30px;
                    height: 30px;

                    img {
                        width: 100%;
                        height: 100%;
                        cursor: pointer;
                    }
                }

                .import-source-element-description {
                    height: 30px;
                    line-height: 30px;
                    margin-left: 12px;
                    font-weight: 500;
                    color: $secondary-text;
                }
            }
        }
    }
</style>
