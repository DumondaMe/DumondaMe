<template>
    <div class="public-landing-page">
        <dumonda-me-header></dumonda-me-header>
        <what-is-dumonda-me></what-is-dumonda-me>
        <question-answer></question-answer>
        <commitments></commitments>
        <live-events></live-events>
        <networking></networking>
        <relevance></relevance>
        <for-the-good-of-all></for-the-good-of-all>
        <sociocracy></sociocracy>
        <transparency></transparency>
        <scalability></scalability>
        <privacy></privacy>
        <roadmap></roadmap>
        <about-us></about-us>
        <youtube></youtube>
        <why-dumonda-me></why-dumonda-me>
        <donation></donation>
        <register></register>
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
            margin: 124px auto 24px auto;
            display: flex;
            align-items: center;
            justify-content: center;

            .public-image {
                img {
                    border-radius: 4px;
                }
            }

            .public-description-container {
                padding-left: 32px;
                width: 100%;

                h2.title-description {
                    color: $primary-color;
                    font-weight: 500;
                    font-size: 32px;
                    margin-bottom: 24px;
                }

                .description {
                    color: $secondary-text;
                    font-size: 18px;
                }

                button.action-button {
                    margin-top: 18px;
                    margin-left: 0;
                    margin-right: 0;
                }
            }

            .public-description-container.left-description {
                padding-left: 0;
                padding-right: 32px;
            }
        }
    }
</style>
