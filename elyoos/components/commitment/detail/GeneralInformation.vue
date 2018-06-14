<template>
    <div class="general-info-container">
        <div class="commitment-info">
            <v-icon class="info-icon">mdi-eye</v-icon>
            <div v-if="commitment.numberOfWatches > 0">
                {{$t('pages:detailCommitment.generalInfo.watchers', {count: commitment.numberOfWatches})}}</div>
            <div v-else>{{$t('pages:detailCommitment.generalInfo.watchersNotExisting')}}</div>
        </div>
        <div class="commitment-info topics">
            <v-icon class="info-icon">mdi-key</v-icon>
            <div id="topic-container">
                <span class="topic" v-for="(topic, index) in commitment.topics">
                    {{topic}}<span v-if="index < commitment.topics.length - 1">, </span></span>
            </div>
        </div>
        <div class="commitment-info" v-if="commitment.website">
            <v-icon class="info-icon">mdi-link</v-icon>
            <a target="_blank" :href="commitment.website">{{website}}</a>
        </div>
        <div class="commitment-info regions">
            <v-icon class="info-icon">mdi-map-marker</v-icon>
            <div id="region-container">
                <div v-for="region in commitment.regions">{{$t("regions:" + region)}}</div>
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
</style>
