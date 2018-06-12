<template>
    <div class="user-commitment-info ely-card">
        <div class="commitment-content">
            <div class="commitment-image">
                <img :src="commitment.imageUrl"/>
            </div>
            <div>
                <div class="commitment-title" @click="$router.push({name: 'commitment-commitmentId-slug',
                     params: {commitmentId: commitment.commitmentId, slug: commitment.commitmentSlug}})">
                    {{commitment.title}}
                </div>
                <expand-text :expand-text="commitment.description" class="description">
                </expand-text>
            </div>
        </div>
        <div class="info-container">
            <div class="info-icon-element">
                <v-icon class="info-icon">mdi-help-circle-outline</v-icon>
                <span class="info-text">{{commitment.numberOfLinkedQuestions}}</span>
            </div>
            <div class="info-icon-element">
                <v-icon class="info-icon">mdi-eye</v-icon>
                <span class="info-text">{{commitment.numberOfWatches}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import ExpandText from '~/components/common/text/Expand.vue'

    export default {
        props: ['commitment'],
        components: {ExpandText},
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            },
            isLoggedInUser() {
                return this.$store.state.userProfile.user.isLoggedInUser;
            }
        },
        methods: {}
    }
</script>

<style lang="scss">
    .user-commitment-info {
        margin-bottom: 8px;
        .commitment-content {
            display: flex;
            .commitment-image {
                margin-right: 18px;
                img {
                    width: 120px;
                    height: 120px;
                    border-radius: 2px;
                }
            }
            .commitment-title {
                cursor: pointer;
                color: $primary-color;
                font-size: 16px;
                font-weight: 400;
            }
            :hover.commitment-title {
                text-decoration: underline;
            }
            .description {
                font-size: 16px;
                font-weight: 300;
            }
        }
        .info-container {
            margin-top: 12px;
            .info-icon-element {
                display: inline-block;
                font-size: 12px;
                font-weight: 400;
                color: $secondary-text;
                margin-right: 12px;
                .info-icon {
                    font-size: 16px;
                    margin-right: 0;
                }
                .info-text {
                    margin-left: 6px;
                    vertical-align: middle;
                    line-height: 16px;
                }
            }
        }
    }
</style>
