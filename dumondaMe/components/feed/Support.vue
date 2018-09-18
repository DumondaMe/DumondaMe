<template>
    <div class="feed-support-container ely-card">
        <h3 class="feed-desktop-sidebar-title">{{$t('pages:feeds.support.title')}}</h3>
        <div class="description">{{$t('pages:feeds.support.description')}}
        </div>
        <div class="open-show-more">{{$t('pages:feeds.support.moreLink')}}</div>
    </div>
</template>

<script>
    export default {
        components: {},
        data() {
            return {showCreateCommitmentDialog: false}
        }
    }
</script>

<style lang="scss">
    .feed-support-container {
        margin-bottom: 18px;
        h3.feed-desktop-sidebar-title {
            margin-bottom: 12px;
        }
        .description {
            font-size: 14px;
            font-weight: 300;
            margin-bottom: 8px;
        }
        .open-show-more {
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: $primary-color;
        }
        :hover.open-show-more {
            text-decoration: underline;
        }
    }
</style>