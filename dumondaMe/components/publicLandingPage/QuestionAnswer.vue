<template>
    <div class="public-question-answer explanation-element">
        <div class="public-description-container left-description">
            <h2 class="title-description">{{$t('pages:landingPagePublic.questionAnswer.title')}}</h2>
            <div class="public-image" @click="$router.push({name: 'question'})" v-if="showMobile">
                <img :src="concept">
            </div>
            <div class="description">
                {{$t('pages:landingPagePublic.questionAnswer.description')}}
            </div>
            <v-btn color="secondary" class="action-button" @click="$router.push({name: 'question'})">
                {{$t('pages:landingPagePublic.questionAnswer.actionButton')}}
            </v-btn>
        </div>
        <div class="public-image" @click="$router.push({name: 'question'})" v-if="!showMobile">
            <img :src="concept">
        </div>
    </div>
</template>

<script>
    export default {
        props: ['showMobile'],
        computed: {
            concept() {
                return `${process.env.staticUrl}/img/landingPagePublic/concept_2x.jpg`;
            },
        }
    }
</script>

<style lang="scss">
    .public-question-answer {
        .public-image {
            img {
                cursor: pointer;
                max-width: 570px;
            }
        }
    }
</style>
