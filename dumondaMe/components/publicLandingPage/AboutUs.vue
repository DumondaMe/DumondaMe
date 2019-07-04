<template>
    <div class="public-about-us explanation-element">
        <div class="public-image" @click="$router.push({name: 'aboutUs'})" v-if="!showMobile">
            <img v-lazy="team">
        </div>
        <div class="public-description-container">
            <h2 class="title-description">{{$t('pages:landingPagePublic.aboutUs.title')}}</h2>
            <div class="public-image" @click="$router.push({name: 'aboutUs'})" v-if="showMobile">
                <img v-lazy="team">
            </div>
            <div class="description">
                {{$t('pages:landingPagePublic.aboutUs.description')}}
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'aboutUs'})">
                {{$t('pages:landingPagePublic.aboutUs.actionButton')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            team() {
                return `${process.env.staticUrl}/img/landingPagePublic/team.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-about-us {
        .public-image {
            cursor: pointer;
        }
    }
</style>
