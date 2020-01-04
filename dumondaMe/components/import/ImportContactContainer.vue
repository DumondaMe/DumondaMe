<template>
    <div class="import-source-container">
        <div class="import-source-description">
            {{$t('dialog:invite:importSourceDescription')}}
        </div>
        <div class="import-hint">
            {{$t('dialog:invite:importHint')}}
        </div>
        <div class="import-source-inner-container">
            <v-layout row wrap>
                <v-flex xs12 sm4>
                    <div class="import-source"
                         @click="openOAuthImport(sendGMailImportRequest, oAuthGoogleClientUrl, googleParser)">
                        <div class="import-source-image">
                            <img :src="getImportUrl('gmail.png')"/>
                        </div>
                        <div class="import-source-element-description">Gmail</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4>
                    <div class="import-source"
                         @click="openOAuthImport(sendOutlookImportRequest, oAuthOutlookClientUrl, outlookParser)">
                        <div class="import-source-image">
                            <img :src="getImportUrl('outlook.png')"/>
                        </div>
                        <div class="import-source-element-description">Outlook.com</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4>
                    <div class="import-source" @click="$emit('show-basic-auth-gmx')">
                        <div class="import-source-image">
                            <img :src="getImportUrl('gmx.png')"/>
                        </div>
                        <div class="import-source-element-description">GMX</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4>
                    <div class="import-source" @click="$emit('show-basic-auth-webde')">
                        <div class="import-source-image">
                            <img :src="getImportUrl('webde.png')"/>
                        </div>
                        <div class="import-source-element-description">WEB.DE</div>
                    </div>
                </v-flex>
                <v-flex xs12 sm4>
                    <v-menu v-model="showCsvFileInfo" open-on-hover :open-on-click="false"
                            bottom offset-y max-width="320">
                        <template v-slot:activator="{ on }">
                            <div class="import-source" @click="openCsvFileDialog()" v-on="on">
                                <div class="import-source-image">
                                    <input type="file" accept=".csv" style="display: none" ref="csvFileDialog"
                                           @change="handleCsvFileImport"/>
                                    <img :src="getImportUrl('csv.png')"/>
                                </div>
                                <div class="import-source-element-description">CSV Datei</div>
                            </div>
                        </template>
                        <v-card class="csv-info-card">
                            {{$t('dialog:invite.infoCsvFile')}}
                        </v-card>
                    </v-menu>
                </v-flex>
                <v-flex xs12 sm4>
                    <div class="import-source" @click="$emit('show-manually')">
                        <div class="import-source-icon">
                            <v-icon color="primary" size="30">$vuetify.icons.mdiAccountPlus</v-icon>
                        </div>
                        <div class="import-source-element-description">
                            {{$t('dialog:invite.manually.importLabel')}}
                        </div>
                    </div>
                </v-flex>
            </v-layout>
        </div>
    </div>
</template>

<script>

    import oAuthWindow from './oAuthWindow';
    import parseGoogleOAuthUrl from './parseGoogleOAuthUrl';
    import parseOutlookOAuthUrl from './parseOutlookOAuthUrl';
    import parseCsvFile from './parseCsvFile';
    import Vue from 'vue';

    let vm;

    export default {
        data() {
            vm = this;
            return {
                oAuthWindow: null, checkWindowInterval: null, googleParser: parseGoogleOAuthUrl,
                oAuthGoogleClientUrl: process.env.oAuthGoogleClientUrl,
                oAuthOutlookClientUrl: process.env.oAuthOutlookClientUrl, outlookParser: parseOutlookOAuthUrl,
                showCsvFileInfo: false
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
                } else if (this.oAuthWindow && typeof this.oAuthWindow.focus === 'function') {
                    this.oAuthWindow.focus();
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
            },
            openCsvFileDialog() {
                this.$refs.csvFileDialog.value = null; //Needed to open same file twice
                this.$refs.csvFileDialog.click();
            },
            async handleCsvFileImport(e) {
                if (e.target.files.length === 1) {
                    if (typeof FileReader === 'function') {
                        vm.$emit('parsing-started');
                        await Vue.nextTick();
                        const reader = new FileReader();
                        reader.onload = function () {
                            vm.$emit('contacts-only-email-loaded', parseCsvFile.parseEmails(reader.result));
                            vm.$emit('parsing-ended');
                        };

                        reader.readAsText(e.target.files[0]);
                    }
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
            padding-top: 16px;
            font-size: 16px;
            font-weight: 300;
            margin-bottom: 12px;
            color: $primary-text;
        }

        .import-hint {
            margin-bottom: 18px;
            font-size: 16px;
            font-weight: 300;
            color: $secondary-color;
            border-left: 2px solid $secondary-color;
            padding-left: 12px;
        }

        .import-source-inner-container {
            padding: 0 12px;

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

    .csv-info-card {
        padding: 16px;
        max-width: 250px;
    }
</style>
