<template>
    <div id="privacy-setting-container">
        <div class="privacy-description">{{$t('pages:settings.privacy.privacyModeDescription')}}</div>
        <v-radio-group v-model="privacyMode" id="select-privacy-setting" :disabled="loading">
            <v-radio value="public" color="primary">
                <span slot="label">{{$t("pages:settings.privacy.privacyModePublic")}}</span>
            </v-radio>
            <v-radio value="publicEl" color="primary">
                <span slot="label">{{$t("pages:settings.privacy.privacyModePublicOnDumondaMe")}}</span>
            </v-radio>
            <v-radio value="onlyContact" color="primary">
                <span slot="label">{{$t("pages:settings.privacy.privacyModeOnlyContact")}}</span>
            </v-radio>
        </v-radio-group>
        <div class="privacy-description">{{$t('pages:settings.privacy.showActivityDescription')}}</div>
        <div id="select-hide-activity">
            <v-checkbox v-model="showProfileActivity" :label="$t('pages:settings.privacy.showActivity')"
                        color="primary" :disabled="loading">
            </v-checkbox>
        </div>
    </div>
</template>

<script>
    import VCheckbox from "vuetify/lib/components/VCheckbox/VCheckbox";

    export default {
        components: {VCheckbox},
        data() {
            return {
                privacyMode: this.$store.state.setting.privacyMode,
                showProfileActivity: this.$store.state.setting.showProfileActivity, loading: false
            }
        },
        watch: {
            async privacyMode(newPrivacyMode) {
                try {
                    this.loading = true;
                    await this.$store.dispatch('setting/setPrivacy', {
                        privacyMode: newPrivacyMode,
                        showProfileActivity: this.showProfileActivity
                    });
                } finally {
                    this.loading = false;
                }
            },
            async showProfileActivity(newShowProfileActivity) {
                try {
                    this.loading = true;
                    await this.$store.dispatch('setting/setPrivacy', {
                        privacyMode: this.privacyMode,
                        showProfileActivity: newShowProfileActivity
                    });
                } finally {
                    this.loading = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    #privacy-setting-container {
        margin-top: 12px;

        #select-privacy-setting {
            margin-bottom: 24px;
            @media screen and (max-width: $xs) {
                margin-bottom: 12px;
            }

            label {
                width: auto;
            }
        }

        .privacy-description {
            margin-top: 0;
            font-weight: 300;
        }
    }
</style>
