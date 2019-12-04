<template>
    <div class="feed-networking-container ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.networking.title')}}</h3>
        <img v-lazy="networkingImage" :data-srcset="networking2xImage" class="networking-image"
             @click="showImportContactDialog = true">
        <div class="feed-networking-description">{{$t('pages:feeds.networking.description')}}</div>
        <v-btn outlined color="primary" @click="showImportContactDialog = true">
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
                return `${process.env.staticUrl}/img/landingPage/networkingImage.jpg 300w, ` +
                    `${process.env.staticUrl}/img/landingPage/networkingImage_2x.jpg 600w`;
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
            @include defaultPaddingCard();
        }

        .networking-image {
            width: 100%;
            margin-bottom: 8px;
            cursor: pointer;
        }

        .feed-networking-description {
            margin-bottom: 8px;
            @include defaultPaddingCard();
        }

        button {
            margin-left: 18px;

            @media screen and (max-width: 700px) {
                margin-left: 12px;

            }
        }

    }
</style>