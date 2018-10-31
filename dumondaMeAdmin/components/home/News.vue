<template>
    <div id="dumonda-me-news-overview" class="ely-card">
        <div class="add-news-button">
            <v-btn color="secondary" @click="showSendNewsletterDialog = true">
                {{$t('pages:home.news.addNewsButton')}}
            </v-btn>
        </div>
        <div class="news" v-for="item of news">
            <div class="news-title">{{item.title}}</div>
            <div class="publish-time">{{item.created | formatDate}}</div>
            <div v-html="item.text" class="news-text"></div>
        </div>
        <create-newsletter-dialog @close-dialog="showSendNewsletterDialog = false" v-if="showSendNewsletterDialog">
        </create-newsletter-dialog>
    </div>
</template>

<script>
    import CreateNewsletterDialog from '~/components/news/dialog/SendNewsletter';

    export default {
        data() {
            return {showSendNewsletterDialog: false}
        },
        components: {CreateNewsletterDialog},
        methods: {},
        computed: {
            news() {
                return this.$store.state.home.news;
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-news-overview {
        margin-right: 28px;
        display: inline-block;
        width: 300px;
        height: 400px;
        overflow-y: auto;
        .add-news-button {
            margin-bottom: 12px;
            width: 100%;
            button {
                margin-left: 0;
                width: 100%;
            }
        }
        .news {
            .news-title {
                font-weight: 500;
                font-size: 16px
            }
            .publish-time {
                font-size: 14px;
                color: $secondary-text;
            }
            .news-text {
                margin-top: 8px;
                margin-bottom: 18px;
            }
        }
    }
</style>
