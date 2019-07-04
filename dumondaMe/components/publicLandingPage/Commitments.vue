<template>
    <div class="public-commitments explanation-element">
        <div class="public-image" @click="$router.push({name: 'commitment'})" v-if="!showMobile">
            <img :src="commitment">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">{{$t('pages:landingPagePublic.commitment.title')}}</h2>
            <div class="public-image" @click="$router.push({name: 'commitment'})" v-if="showMobile">
                <img :src="commitment">
            </div>
            <div class="description">
                {{$t('pages:landingPagePublic.commitment.description')}}
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'commitment'})">
                {{$t('pages:landingPagePublic.commitment.actionButton')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            commitment() {
                return `${process.env.staticUrl}/img/landingPagePublic/commitment.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-commitments {
        .public-image {
            cursor: pointer;
        }
    }
</style>
