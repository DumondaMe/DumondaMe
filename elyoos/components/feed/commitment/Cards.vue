<template>
    <div id="commitment-cards-container">
        <div class="commitment-card ely-card" v-for="commitment in commitments" :key="commitment.answerId">
            <div class="image-container">
                <img :src="commitment.imageUrl">
            </div>
            <div class="info-container">
                <h2>
                    <nuxt-link :to="{name: 'commitment-answerId-slug',
                                 params: {answerId: commitment.answerId, slug: commitment.slug}}">
                        {{commitment.title}}
                    </nuxt-link>
                </h2>
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
                    width: 100%;
                }
            }
            .info-container {
                margin-left: 138px;
                min-height: 120px;
                h2 {
                    margin-top: 0;
                    font-size: 18px;
                    font-weight: 400;
                    a {
                        color: $primary-text;
                        text-decoration: none;
                    }
                }
                h2:hover {
                    text-decoration: underline;
                }
                .description {
                    margin-top: 6px;
                    .expand-text-container {
                        p {
                            max-height: 6.4em;
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
