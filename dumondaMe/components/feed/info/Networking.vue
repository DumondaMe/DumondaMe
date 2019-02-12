<template>
    <div class="feed-networking-container ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.networking.title')}}</h3>
        <img :src="networkingImage" :srcset="networking2xImage" class="networking-image">
        <div class="feed-networking-description">{{$t('pages:feeds.networking.description')}}</div>
        <v-btn outline color="primary" @click="showImportContactDialog = true">
            {{$t('pages:feeds.networking.actionButton')}}
        </v-btn>
        <import-contact-dialog v-if="showImportContactDialog" @close-dialog="showImportContactDialog = false">
        </import-contact-dialog>
    </div>
</template>

<script>
    import ImportContactDialog from '~/components/import/ImportContactDialog';

    export default {
        components: {ImportContactDialog},
        data() {
            return {showImportContactDialog: false}
        },
        computed: {
            networkingImage() {
                return `${process.env.staticUrl}/img/landingPage/networkingImage.jpg`;
            },
            networking2xImage() {
                return `${process.env.staticUrl}/img/landingPage/networkingImage_2x.jpg 2x`;
            }
        }
    }
</script>

<style lang="scss">
    .feed-networking-container {
        margin-bottom: 18px;
        font-size: 14px;
        font-weight: 300;

        h3.feed-desktop-sidebar-title {
            margin-bottom: 12px;
        }

        .networking-image {
            width: 100%;
            border-radius: 4px;
            margin-bottom: 8px;
        }

        .feed-networking-description {
            margin-bottom: 8px;
        }

        button {
            margin-left: 0;
        }

    }
</style>