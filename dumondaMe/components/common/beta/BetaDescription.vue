<template>
    <div class="beta-version-description ely-card" :class="{'is-authenticated': isAuthenticated}">
        <h3 class="beta-version-title">{{$t('common:beta.title')}}</h3>
        <img :src="betaImage" :srcset="beta2xImage" class="beta-version-image">
        <div class="description">{{$t('common:beta.description')}}</div>
        <v-btn outline color="primary" @click="$router.push({name: 'nextSteps'})">
            {{$t('common:beta.buttonNextSteps')}}
        </v-btn>
    </div>
</template>

<script>
    export default {
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated;
            },
            betaImage() {
                return `${process.env.staticUrl}/img/landingPage/beta.jpg`;
            },
            beta2xImage() {
                return `${process.env.staticUrl}/img/landingPage/beta_2x.jpg 2x`;
            }
        }
    }
</script>

<style lang="scss">
    .beta-version-description {
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 300;
        @media screen and (max-width: $xs) {
            font-size: 16px;
            max-width: 550px;
            margin-right: auto;
            margin-left: auto;
            margin-bottom: 0;
        }

        h3.beta-version-title {
            color: $secondary-color;
            margin-bottom: 12px;
            font-size: 16px;
            font-weight: 500;
            @media screen and (max-width: $xs) {
                color: $primary-text;
            }
        }

        .beta-version-image {
            width: 100%;
        }

        .description {
            margin-top: 8px;
            margin-bottom: 8px;
            @media screen and (max-width: $xs) {
                margin-bottom: 0;
            }
        }

        button {
            margin-left: 0;
        }
    }

    .beta-version-description.is-authenticated {
        @media screen and (max-width: $xs) {
            margin-top: 58px;
        }
    }
</style>
