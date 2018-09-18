<template>
    <div id="privacy-setting-container">
        <h2 class="user-profile-title">{{$t("pages:settings.privacyTitle")}}</h2>
        <v-radio-group v-model="privacyMode" id="select-privacy-setting">
            <v-radio value="public" color="primary">
                <span slot="label">{{$t("pages:settings.privacyPublic")}}</span>
            </v-radio>
            <v-radio value="publicEl" color="primary">
                <span slot="label">{{$t("pages:settings.privacyPublicOnElyoos")}}</span>
            </v-radio>
            <v-radio value="onlyContact" color="primary">
                <span slot="label">{{$t("pages:settings.privacyOnlyContact")}}</span>
            </v-radio>
        </v-radio-group>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                privacyMode: this.$store.state.setting.setting.privacyMode
            }
        },
        watch: {
            privacyMode(newPrivacyMode) {
                this.$store.dispatch('setting/setPrivacy', newPrivacyMode);
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
