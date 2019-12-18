<template>
    <div class="commitment-contributors ely-card" v-if="contributors.length > 0">
        <h3>{{$t("pages:detailCommitment.contributors.title")}}</h3>
        <div class="commitment-contributors-container">
            <contributor :contributor="contributor" v-for="contributor of contributors"
                        :key="contributor.userId"></contributor>
        </div>
    </div>
</template>

<script>
    import language from '~/mixins/languages.js';
    import Contributor from './Contributor';

    export default {
        mixins: [language],
        computed: {
            contributors() {
                return this.$store.state.commitment.commitment.contributors
            }
        },
        components: {Contributor}
    }
</script>

<style lang="scss">
    .commitment-contributors {
        margin-top: 18px;

        @media screen and (max-width: $sm) {
            margin-top: 8px;
        }

        h3 {
            font-size: 16px;
            font-weight: 500;

            @media screen and (max-width: $sm) {
                font-weight: 400;
            }
        }

        .commitment-contributors-container {
            margin-top: 18px;

        }
    }

    .commitment-contributors.ely-card {
        @include defaultPaddingCard();
        @media screen and (max-width: $sm) {
            padding-left: 16px;
            padding-right: 16px;
        }
    }
</style>
