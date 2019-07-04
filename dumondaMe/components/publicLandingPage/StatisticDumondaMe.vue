<template>
    <div class="public-scalability-statistic">
        <div class="statistic-title">{{$t('pages:landingPagePublic.scalability.statistic.title')}}</div>
        <div class="statistic-element">
            <div class="statistic-description">{{$t('pages:landingPagePublic.scalability.statistic.numberOfUsers')}}
            </div>
            <v-spacer></v-spacer>
            <div class="statistic-number">{{statistic.numberOfUsers}}</div>
        </div>
        <div class="statistic-element">
            <div class="statistic-description">
                {{$t('pages:landingPagePublic.scalability.statistic.numberOfCommitments')}}
            </div>
            <v-spacer></v-spacer>
            <div class="statistic-number">{{statistic.numberOfCommitments}}</div>
        </div>
        <div class="statistic-element">
            <div class="statistic-description">
                {{$t('pages:landingPagePublic.scalability.statistic.numberOfQuestions')}}
            </div>
            <v-spacer></v-spacer>
            <div class="statistic-number">{{statistic.numberOfQuestions}}</div>
        </div>
        <div class="statistic-element">
            <div class="statistic-description">{{$t('pages:landingPagePublic.scalability.statistic.numberOfAnswers')}}
            </div>
            <v-spacer></v-spacer>
            <div class="statistic-number">{{statistic.numberOfAnswers}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {statistic: {}}
        },
        async mounted() {
            this.statistic = await this.$axios.$get('statistic');
        }
    }
</script>

<style lang="scss">
    .public-scalability {
        .public-scalability-statistic {
            border: 1px solid $divider;
            border-radius: 4px;
            padding: 16px;
            background-color: $background-normal;

            @media screen and (min-width: 900px) {
                min-width: 350px;
            }

            @media screen and (max-width: 900px) {
                margin-bottom: 18px;
            }

            .statistic-title {
                font-weight: 500;
                font-size: 20px;
                text-decoration: underline;
                margin-bottom: 12px;
                color: $secondary-text;
            }

            .statistic-element {
                display: flex;
                font-size: 18px;

                .statistic-description {
                    color: $secondary-text;
                }


                .statistic-number {
                    color: $primary-color;
                    font-weight: 500;
                }
            }
        }
    }
</style>
