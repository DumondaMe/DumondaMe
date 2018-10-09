<template>
    <div id="feed-empty">
        <div class="description" v-if="activeTypeFilter === null">
            {{$t('pages:feeds.empty.descriptionAllFilter')}}
        </div>
        <div class="description" v-if="activeTypeFilter === 'question'">
            {{$t('pages:feeds.empty.descriptionQuestionFilter')}}
        </div>
        <div class="description" v-if="activeTypeFilter === 'commitment'">
            {{$t('pages:feeds.empty.descriptionCommitmentFilter')}}
        </div>
        <div class="description" v-if="activeTypeFilter === 'event'">
            {{$t('pages:feeds.empty.descriptionEventFilter')}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "FeedEmpty",
        computed: {
            activeTypeFilter() {
                return this.$store.state.feed.typeFilter;
            }
        },
    }
</script>

<style lang="scss">
    #feed-empty {
        margin-top: 32px;
        .description {
            font-weight: 300;
            margin-bottom: 18px;
        }
    }
</style>