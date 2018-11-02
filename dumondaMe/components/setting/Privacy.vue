<template>
    <div id="privacy-setting-container">
        <h2 class="user-profile-title">{{$t("pages:settings.privacyTitle")}}</h2>
        <v-radio-group v-model="privacyMode" id="select-privacy-setting">
            <v-radio value="public" color="primary">
                <span slot="label">{{$t("pages:settings.privacyPublic")}}</span>
            </v-radio>
            <v-radio value="publicEl" color="primary">
                <span slot="label">{{$t("pages:settings.privacyPublicOnDumondaMe")}}</span>
            </v-radio>
            <v-radio value="onlyContact" color="primary">
                <span slot="label">{{$t("pages:settings.privacyOnlyContact")}}</span>
            </v-radio>
        </v-radio-group>
        <div id="select-hide-activity">
            <v-checkbox v-model="showProfileActivity" :label="$t('pages:settings.privacyShowActivity')"
            color="primary">
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
                privacyMode: this.$store.state.setting.setting.privacyMode,
                showProfileActivity: this.$store.state.setting.setting.showProfileActivity
            }
        },
        watch: {
            privacyMode(newPrivacyMode) {
                this.$store.dispatch('setting/setPrivacy', {
                    privacyMode: newPrivacyMode,
                    showProfileActivity: this.showProfileActivity
                });
            },
            showProfileActivity(newShowProfileActivity) {
                this.$store.dispatch('setting/setPrivacy', {
                    privacyMode: this.privacyMode,
                    showProfileActivity: newShowProfileActivity
                });
            }
        }
    }
</script>

<style lang="scss">
    #privacy-setting-container {
        margin-top: 12px;
        #select-privacy-setting {
            label {
                width: auto;
            }
        }
    }
</style>
