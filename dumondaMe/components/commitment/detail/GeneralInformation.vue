<template>
    <div class="general-info-container ely-card">
        <div class="commitment-info" v-if="commitment.isAdmin">
            <v-icon class="info-icon icon-admin">mdi-account</v-icon>
            {{$t('common:youAreAdmin')}}
        </div>
        <div class="commitment-info" v-if="commitment.website">
            <v-icon class="info-icon">mdi-link</v-icon>
            <a target="_blank" rel="noopener" :href="commitment.website">{{website}}</a>
        </div>
        <div class="commitment-info topics">
            <v-icon class="info-icon">mdi-key</v-icon>
            <div id="topic-container">
                <span class="topic" v-for="(topic, index) in commitment.topics">
                    {{topic.description}}<span v-if="index < commitment.topics.length - 1">, </span></span>
            </div>
        </div>
        <div class="commitment-info regions">
            <v-icon class="info-icon">mdi-map-marker</v-icon>
            <div id="region-container">
                <div v-for="region in commitment.regions">{{region.description}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import language from '~/mixins/languages.js';
    import {mapGetters} from 'vuex';

    export default {
        mixins: [language],
        computed: {
            website() {
                return this.commitment.website.replace(/(^\w+:|^)\/\//, '')
            },
            ...mapGetters({commitment: 'commitment/getCommitment'})
        }
    }
</script>

<style lang="scss">
    .general-info-container {
        margin-top: 18px;
        @include defaultPaddingCard();
        @media screen and (max-width: $sm) {
            margin-top: 0;
        }

        .commitment-info {
            display: block;
            font-size: 14px;
            font-weight: 300;
            margin-bottom: 3px;
            width: 100%;

            #topic-container {
                margin-left: 30px;

                .topic {
                    font-size: 14px;
                }
            }

            .info-icon {
                margin-top: 2px;
                float: left;
                margin-right: 12px;
                font-size: 18px;
                color: #90A4AE;
            }

            i.icon-admin.v-icon {
                color: $success-text;
            }

            #region-container {
                margin-left: 30px;
            }

            a {
                display: block;
                margin-left: 30px;
                max-width: 100%;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        }

        .commitment-info.topics {
            .info-icon {
                margin-top: 2px;
            }
        }

        .commitment-info.regions {
            .info-icon {
                margin-top: 2px;
            }
        }
    }

    .general-info-container.ely-card {
        @media screen and (max-width: $sm) {
            padding-left: 16px;
            padding-right: 16px;
        }
    }
</style>
