<template>
    <div class="dumonda-me-topic-card ely-card">
        <img v-lazy="topicPreview" class="topic-image"/>
        <h2>{{topicDescription}}</h2>
        <div class="navigation-container">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small outlined fab color="primary"
                           @click="navigate('question')">
                        <v-icon size="18">mdi-help</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('pages:topic.navigation.question', {topic: topicDescription})}}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small outlined fab color="primary"
                           @click="navigate('commitment')">
                        <v-icon size="18">mdi-human-handsup</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('pages:topic.navigation.commitment', {topic: topicDescription})}}</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small outlined fab color="primary"
                           @click="navigate('event')">
                        <v-icon size="18">mdi-calendar</v-icon>
                    </v-btn>
                </template>
                <span>{{$t('pages:topic.navigation.event', {topic: topicDescription})}}</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['topicId', 'topicDescription', 'topicPreview', 'topicThumbnail'],
        methods: {
            navigate(destination) {
                this.$store.commit('feedFilter/SET_TOPIC_FILTER', [{
                    id: this.topicId,
                    description: this.topicDescription,
                    image: this.topicPreview,
                    thumbnail: this.topicThumbnail
                }]);
                this.$store.commit('feedFilter/SET_FILTER_ACTIVE', true);
                this.$router.push({name: destination, query: {topic: [this.topicId]}})
            }
        }
    }
</script>

<style lang="scss">
    .dumonda-me-topic-card.ely-card {
        width: 282px;
        padding-right: 0;
        padding-left: 0;
        padding-top: 0;
        margin-right: 18px;
        margin-bottom: 18px;

        @media screen and (max-width: 959px) {
            margin-right: 9px;
            margin-left: 9px;
        }

        .topic-image {
            width: 282px;
            max-height: 190px;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }

        h2 {
            text-align: center;
            padding: 0 8px;
            font-weight: 500;
            height: 60px;

        }

        .navigation-container {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 8px;

            .v-btn {
                margin-right: 8px;
                margin-left: 8px;
                margin-bottom: 8px;
            }
        }
    }
</style>
