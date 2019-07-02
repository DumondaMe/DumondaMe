<template>
    <div class="public-landing-page">
        <dumonda-me-header></dumonda-me-header>
        <what-is-dumonda-me :show-mobile="showMobile"></what-is-dumonda-me>
        <question-answer :show-mobile="showMobile"></question-answer>
        <commitments :show-mobile="showMobile"></commitments>
        <live-events></live-events>
        <networking :show-mobile="showMobile"></networking>
        <relevance :show-mobile="showMobile"></relevance>
        <for-the-good-of-all :show-mobile="showMobile"></for-the-good-of-all>
        <sociocracy :show-mobile="showMobile"></sociocracy>
        <transparency :show-mobile="showMobile"></transparency>
        <scalability :show-mobile="showMobile"></scalability>
        <privacy :show-mobile="showMobile"></privacy>
        <roadmap :show-mobile="showMobile"></roadmap>
        <about-us :show-mobile="showMobile"></about-us>
        <youtube :show-mobile="showMobile"></youtube>
        <why-dumonda-me :show-mobile="showMobile"></why-dumonda-me>
        <register :show-mobile="showMobile"></register>
    </div>
</template>

<script>
    import DumondaMeHeader from './Header';
    import WhyDumondaMe from './WhyDumondaMe';
    import WhatIsDumondaMe from './WhatIsDumondaMe';
    import QuestionAnswer from './QuestionAnswer';
    import Commitments from './Commitments';
    import LiveEvents from './LiveEvents';
    import Networking from './Networking';
    import Relevance from './Relevance';
    import ForTheGoodOfAll from './ForTheGoodOfAll';
    import Sociocracy from './Sociocracy';
    import AboutUs from './AboutUs';
    import Youtube from './Youtube';
    import Transparency from './Transparency';
    import Scalability from './Scalability';
    import Privacy from './Privacy';
    import Roadmap from './Roadmap';
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
            WhatIsDumondaMe,
            DumondaMeHeader, WhyDumondaMe, QuestionAnswer, Commitments, LiveEvents, Networking, Relevance,
            ForTheGoodOfAll, Sociocracy, AboutUs, Youtube, Transparency, Scalability, Privacy, Roadmap,
            Register, Donation
        },
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
