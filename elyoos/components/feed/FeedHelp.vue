<template>
    <div id="feed-help">
        <h2 class="feed-help-title">{{$t('pages:feeds.help.trustCircle.title')}}</h2>
        <div class="image-text-container">
            <img :src="getTrustCircleImage">
            <div class="description">
                {{$t('pages:feeds.help.trustCircle.description')}}
            </div>
        </div>
        <h2 class="feed-help-title">{{$t('pages:feeds.help.question.title')}}</h2>
        <div class="text-container">
            <div class="description">
                {{$t('pages:feeds.help.question.description')}}
            </div>
        </div>
        <h2 class="feed-help-title">{{$t('pages:feeds.help.commitment.title')}}</h2>
        <div class="text-container">
            <div class="description">
                {{$t('pages:feeds.help.commitment.description')}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "FeedHelp",
        computed: {
            getTrustCircleImage() {
                return `${process.env.staticUrl}/img/trustCircle.jpg`;
            }
        },
    }
</script>

<style lang="scss">
    #feed-help {
        margin-top: 32px;
        .description {
            font-weight: 300;
            margin-bottom: 18px;
        }
        .feed-help-title {
            margin-bottom: 8px;
        }
        .image-text-container {
            img {
                float: right;
                height: 150px;
                width: 150px;
            }
            .description {
                min-height: 150px;
                margin-right: 162px;
            }
        }
    }
</style>