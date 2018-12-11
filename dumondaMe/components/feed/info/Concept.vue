<template>
    <div class="feed-concept-info-container ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.conceptInfo.title')}}</h3>
        <v-btn outline color="primary" @click="showConceptInfoDialog = true">
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

        button {
            margin-left: 0;
        }

    }
</style>