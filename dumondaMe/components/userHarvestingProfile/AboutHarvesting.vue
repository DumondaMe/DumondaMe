<template>
    <div class="harvesting-information ely-card">
        <div class="harvesting-title">
            {{$t('pages:detailUser.harvesting.info.title')}}
        </div>
        <img :src="onTourOnlineImage" class="on-tour-image" v-if="isOnlineHarvesting"/>
        <img :src="onTourImage" class="on-tour-image" v-else/>
        <div class="harvesting-description" v-if="isOnlineHarvesting"
             v-html="$t('pages:detailUser.harvesting.info.descriptionOnlineHarvesting', {name: partnerName})">
        </div>
        <div class="harvesting-description" v-else>
            {{$t('pages:detailUser.harvesting.info.description')}}
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            onTourImage() {
                return `${process.env.staticUrl}/img/user/onTour.jpg`;
            },
            onTourOnlineImage() {
                return `${process.env.staticUrl}/img/user/onTourOnline.jpg`;
            },
            isOnlineHarvesting() {
                return this.$store.state.userProfile.user.isOnlineHarvesting;
            },
            partnerName() {
                return this.$store.state.userProfile.user.forename;
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

            b {
                font-weight: 400;
                color: $primary-color;
            }
        }
    }
</style>
