<template>
    <div class="feed-concept-info-container ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.conceptInfo.title')}}</h3>
        <img v-lazy="conceptImage" :data-srcset="concept2xImage" class="concept-image">
        <v-btn outlined color="primary" @click="showConceptInfoDialog = true">
            {{$t('pages:feeds.conceptInfo.actionButton')}}
        </v-btn>
        <concept-info-dialog v-if="showConceptInfoDialog" @close-dialog="showConceptInfoDialog = false">
        </concept-info-dialog>
    </div>
</template>

<script>
    import ConceptInfoDialog from '~/components/info/conceptInfo/ConceptInfoDialog';

    export default {
        components: {ConceptInfoDialog},
        data() {
            return {showConceptInfoDialog: false}
        },
        computed: {
            conceptImage() {
                return `${process.env.staticUrl}/img/landingPage/concept.jpg`;
            },
            concept2xImage() {
                return `${process.env.staticUrl}/img/landingPage/concept.jpg 300w, ` +
                       `${process.env.staticUrl}/img/landingPage/concept_2x.jpg 600w`;
            }
        }
    }
</script>

<style lang="scss">
    .feed-concept-info-container {
        margin-bottom: 18px;
        font-size: 14px;
        font-weight: 300;

        h3.feed-desktop-sidebar-title {
            margin-bottom: 12px;
        }

        .concept-image {
            width: 100%;
            border-radius: 4px;
            margin-bottom: 8px;
        }

        button {
            margin-left: 0;
        }

    }
</style>