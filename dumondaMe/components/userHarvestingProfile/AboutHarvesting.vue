<template>
    <div class="harvesting-information ely-card">
        <div class="harvesting-title">
            {{$t('pages:detailUser.harvesting.info.title')}}
        </div>
        <img :src="onTourImage" class="on-tour-image"/>
        <div class="harvesting-description">
            {{$t('pages:detailUser.harvesting.info.description')}}
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            onTourImage() {
                return `${process.env.staticUrl}/img/user/onTour.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    .harvesting-information {
        max-width: 360px;
        margin: 18px auto 64px auto;

        .harvesting-title {
            @include defaultPaddingCard();
            font-weight: 500;
            padding-bottom: 12px;
        }

        .on-tour-image {
            width: 100%;
        }

        .harvesting-description {
            @include defaultPaddingCard();
            margin-top: 8px;
            font-weight: 300;
        }
    }
</style>
