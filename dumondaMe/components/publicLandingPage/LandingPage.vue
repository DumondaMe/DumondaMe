<template>
    <div class="public-landing-page">
        <dumonda-me-header></dumonda-me-header>
        <what-is-dumonda-me :show-mobile="showMobile"></what-is-dumonda-me>
        <question-answer :show-mobile="showMobile"></question-answer>
        <commitments :show-mobile="showMobile"></commitments>
        <scalability :show-mobile="showMobile"></scalability>
        <about-us :show-mobile="showMobile"></about-us>
        <youtube :show-mobile="showMobile"></youtube>
        <donation :show-mobile="showMobile"></donation>
        <register :show-mobile="showMobile" v-if="!isAuthenticated"></register>
        <dumonda-me-footer id="ely-footer"></dumonda-me-footer>
    </div>
</template>

<script>
    import DumondaMeHeader from './Header';
    import DumondaMeFooter from '~/components/navigation/footer/Footer';
    import WhatIsDumondaMe from './WhatIsDumondaMe';
    import QuestionAnswer from './QuestionAnswer';
    import Commitments from './Commitments';
    import LiveEvents from './LiveEvents';
    import AboutUs from './AboutUs';
    import Youtube from './Youtube';
    import Scalability from './Scalability';
    import Donation from './Donation';
    import Register from './Register';

    export default {
        data() {
            return {showMobile: false}
        },
        mounted() {
            this.showMobile = window.innerWidth < 900;
        },
        components: {
            WhatIsDumondaMe, DumondaMeFooter,
            DumondaMeHeader, QuestionAnswer, Commitments, LiveEvents, AboutUs, Youtube, Scalability,
            Register, Donation
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">
    .public-landing-page {
        min-height: 100%;
        background-color: white;

        .explanation-element {
            width: 100%;
            max-width: 1020px;
            padding: 0 16px;
            margin: 48px auto 24px auto;

            @media screen and (min-width: 900px) {
                margin: 124px auto 24px auto;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            @media screen and (max-width: 440px) {
                padding: 0;
            }

            .public-image {
                img {
                    border-radius: 4px;
                    @media screen and (max-width: 900px) {
                        display: block;
                        margin: 0 auto 18px auto;
                        max-width: 100%;
                    }

                    @media screen and (max-width: 500px) {
                        width: 100%;
                    }
                }
            }

            .public-description-container {
                padding-left: 32px;
                width: 100%;

                @media screen and (max-width: 900px) {
                    padding-left: 16px;
                    padding-right: 16px;
                }

                h2.title-description {
                    color: $primary-color;
                    font-weight: 500;
                    font-size: 32px;
                    margin-bottom: 24px;

                    @media screen and (max-width: 900px) {
                        font-size: 24px;
                        margin-bottom: 18px;
                        margin-top: 12px;
                        text-align: center;
                    }
                }

                .description {
                    color: $secondary-text;
                    font-size: 18px;
                }

                button.action-button {
                    margin-top: 18px;
                    margin-left: 0;
                    margin-right: 0;

                    @media screen and (max-width: 900px) {
                        display: block;
                        margin-left: auto;
                        margin-right: auto;
                        width: 100%;
                    }
                }
            }

            .public-description-container.left-description {
                padding-left: 0;
                padding-right: 32px;

                @media screen and (max-width: 900px) {
                    padding-left: 16px;
                    padding-right: 16px;
                }
            }
        }
    }
</style>
