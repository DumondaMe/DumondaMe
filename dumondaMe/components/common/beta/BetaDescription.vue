<template>
    <div class="beta-version-description ely-card" :class="{'is-authenticated': isAuthenticated}">
        <h3 class="beta-version-title">{{$t('common:beta.title')}}</h3>
        <div class="description">{{$t('common:beta.description')}}</div>
    </div>
</template>

<script>
    export default {
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated;
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

        .description {
            margin-bottom: 8px;
            @media screen and (max-width: $xs) {
                margin-bottom: 0;
            }
        }
    }
    .beta-version-description.is-authenticated {
        @media screen and (max-width: $xs) {
            margin-top: 58px;
        }
    }
</style>
