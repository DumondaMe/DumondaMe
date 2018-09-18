<template>
    <div id="feed-help">
        <h2 class="feed-help-title">{{$t('pages:feeds.help.question.title')}}</h2>
        <div class="text-container">
            <p class="description">
                {{$t('pages:feeds.help.question.text1')}}
            </p>
            <ul>
                <li>{{$t('pages:feeds.help.question.text2')}}</li>
                <li>{{$t('pages:feeds.help.question.text3')}}</li>
                <li>{{$t('pages:feeds.help.question.text4')}}</li>
                <li>{{$t('pages:feeds.help.question.text5')}}</li>
            </ul>
        </div>
        <h2 class="feed-help-title">{{$t('pages:feeds.help.trustCircle.title')}}</h2>
        <div class="image-text-container">
            <img :src="getTrustCircleImage">
            <p class="description">{{$t('pages:feeds.help.trustCircle.text1')}}</p>
        </div>
        <h2 class="feed-help-title">{{$t('pages:feeds.help.commitment.title')}}</h2>
        <div class="text-container">
            <p class="description">{{$t('pages:feeds.help.commitment.text1')}}</p>
            <p class="description">{{$t('pages:feeds.help.commitment.text2')}}</p>
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
        }
        ul {
            font-weight: 300;
            font-size: 16px;
            margin-left: 18px;
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