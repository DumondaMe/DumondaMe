<template>
    <profile-image class="select-photo-container">
        <template v-slot:header>
            <div id="dumonda-me-dialog-header">
                {{$t('dialog:invite:photoTitle')}}
            </div>
            <v-divider></v-divider>
        </template>
        <template v-slot:description>
            {{$t('dialog:invite:photoDescription')}}
        </template>
        <template v-slot:footer>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click.native="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" text @click.native="$emit('back')">
                {{$t("common:button.back")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('next')">
                {{$t("common:button.next")}}
            </v-btn>
        </template>
    </profile-image>
</template>

<script>
    import ProfileImage from '~/components/info/welcomeDialog/ProfileImage'

    export default {
        components: {ProfileImage},
    }
</script>

<style lang="scss">
    .select-photo-container {
    }
</style>
