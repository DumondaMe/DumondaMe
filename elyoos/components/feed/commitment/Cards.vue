<template>
    <div id="commitment-cards-container">
        <div class="commitment-card ely-card" v-for="commitment in commitments" :key="commitment.commitmentId">
            <div class="image-container">
                <img :src="commitment.imageUrl">
            </div>
            <div class="info-container">
                <h2>
                    <nuxt-link :to="{name: 'commitment-commitmentId-slug',
                                 params: {commitmentId: commitment.commitmentId, slug: commitment.slug}}">
                        {{commitment.title}}
                    </nuxt-link>
                </h2>
                <div class="regions">
                    <v-icon class="info-region">location_on</v-icon>
                    <span v-for="region in commitment.regions" class="region">{{$t("regions:" + region)}}</span>
                </div>
                <topics :topics="commitment.topics"></topics>
                <div class="description">
                    <expand-text :expand-text="commitment.description">
                    </expand-text>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'
    import Topics from '~/components/common/topic/Topic.vue'

    export default {
        components: {ExpandText, Topics},
        computed: {
            commitments() {
                return this.$store.state.feedCommitment.commitments
            }
        }
    }
</script>

<style lang="scss">
    #commitment-cards-container {
        margin-top: 28px;
        .commitment-card {
            margin-bottom: 12px;
            .image-container {
                float: left;
                max-width: 120px;
                margin-top: 6px;
                img {
                    border-radius: 2px;
                    width: 100%;
                }
            }
            .info-container {
                margin-left: 138px;
                min-height: 120px;
                h2 {
                    margin-top: 6px;
                    font-size: 18px;
                    line-height: 18px;
                    font-weight: 400;
                    a {
                        color: $primary-text;
                        text-decoration: none;
                    }
                }
                h2:hover {
                    text-decoration: underline;
                }
                .regions {
                    display: block;
                    line-height: 14px;
                    margin: 6px 12px 8px 0;
                    .info-region {
                        margin-left: -2px;
                        display: inline-block;
                        font-size: 14px;
                        margin-right: 2px;
                    }
                    .region {
                        font-size: 12px;
                        color: $secondary-text;
                        margin-right: 6px;
                    }
                }
                .description {
                    .expand-text-container {
                        p {
                            white-space: normal;
                            max-height: 4.8em;
                        }
                        p.expand {
                            max-height: none;
                        }
                    }
                }
            }
        }
    }
</style>
