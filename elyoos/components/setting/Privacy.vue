<template>
    <div id="privacy-setting-container">
        <h2 class="user-profile-title">Privatsphäreneinstellungen</h2>
        <v-radio-group v-model="privacyMode">
            <v-radio value="public" color="primary">
                <span slot="label">Dein Profil ist öffentlich</span>
            </v-radio>
            <v-radio value="publicEl" color="primary">
                <span slot="label">Dein Profil wird nur von anderen Benutzern von Elyoos gesehen</span>
            </v-radio>
            <v-radio value="onlyContact" color="primary">
                <span slot="label">Nur deine Kontakte sehen dein Profil</span>
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
    }
</style>
