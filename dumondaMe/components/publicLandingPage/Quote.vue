<template>
    <div class="public-quote explanation-element">
        <div class="public-quote-container">
            <div v-html="$t('pages:landingPagePublic.quote.quote')"></div>
            <div class="quote-author">{{$t('pages:landingPagePublic.quote.author')}}</div>
        </div>
    </div>
</template>

<script>
    export default {}
</script>

<style lang="scss">
    .public-quote.explanation-element {
        .public-quote-container {
            color: white;
            background-color: #BA68C8;
            font-size: 18px;
            font-style: italic;
            padding: 12px 64px;
            text-align: center;
            border-radius: 4px;

            @media screen and (max-width: 900px) {
                padding: 12px 32px;
            }
            @media screen and (max-width: 700px) {
                padding: 12px 12px;
                border-radius: 0;
            }

            .quote-author {
                padding-top: 8px;
                font-style: normal;
                color: white;
                font-weight: 500;
            }
        }
    }
</style>
