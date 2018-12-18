<template>
    <div id="faq-description">
        <h1>{{$t('pages:faq.title')}}</h1>

        <h2>{{$t('pages:faq.importantConcepts.title')}}</h2>
        <ul>
            <li v-html="$t('pages:faq.importantConcepts.text1')"></li>
            <li v-html="$t('pages:faq.importantConcepts.text2')"></li>
            <li v-html="$t('pages:faq.importantConcepts.text3')"></li>
        </ul>
        <v-btn color="primary" class="tour-button" @click="showConceptInfoDialog = true">
            {{$t('pages:faq.importantConcepts.tourButton')}}
        </v-btn>
        <concept-info-dialog v-if="showConceptInfoDialog" @close-dialog="showConceptInfoDialog = false">
        </concept-info-dialog>

        <h2>{{$t('pages:faq.whosBehindDumondaMe.title')}}</h2>
        <p v-html="$t('pages:faq.whosBehindDumondaMe.text1')"></p>
        <v-btn color="primary" class="navigation-button" @click="$router.push({name: 'aboutUs'})">
            {{$t('pages:faq.whosBehindDumondaMe.navigationButton')}}
        </v-btn>

        <h2>{{$t('pages:faq.meaningOfDumondaMe.title')}}</h2>
        <p v-html="$t('pages:faq.meaningOfDumondaMe.text1')"></p>

        <h2>{{$t('pages:faq.differenceSocialNetwork.title')}}</h2>
        <p>{{$t('pages:faq.differenceSocialNetwork.text1')}}</p>
        <img :src="getUrl('img/faq/Concept.jpg')">
        <p v-html="$t('pages:faq.differenceSocialNetwork.text2')"></p>

        <h2>{{$t('pages:faq.advantageAccount.title')}}</h2>
        <p>{{$t('pages:faq.advantageAccount.text1')}}</p>
        <v-btn color="secondary" class="navigation-button" @click="$router.push({name: 'register'})"
               v-if="!isAuthenticated">
            {{$t('common:button.register')}}
        </v-btn>

        <h2>{{$t('pages:faq.commitment.title')}}</h2>
        <p>{{$t('pages:faq.commitment.text1')}}</p>
        <p>{{$t('pages:faq.commitment.text2')}}</p>

        <h2>{{$t('pages:faq.whoCanCreateCommitments.title')}}</h2>
        <p>{{$t('pages:faq.whoCanCreateCommitments.text1')}}</p>

        <h2>{{$t('pages:faq.whatsIsTrustCircle.title')}}</h2>
        <p>{{$t('pages:faq.whatsIsTrustCircle.text1')}}</p>

        <h2>{{$t('pages:faq.whyAreAnswersUpVoted.title')}}</h2>
        <p>{{$t('pages:faq.whyAreAnswersUpVoted.text1')}}</p>

        <h2>{{$t('pages:faq.questionVisibility.title')}}</h2>
        <p>{{$t('pages:faq.questionVisibility.text1')}}</p>

        <h2>{{$t('pages:faq.selfAnswerQuestions.title')}}</h2>
        <p>{{$t('pages:faq.selfAnswerQuestions.text1')}}</p>

        <h2>{{$t('pages:faq.userVisibility.title')}}</h2>
        <p>{{$t('pages:faq.userVisibility.text1')}}</p>

        <h2>{{$t('pages:faq.donation.title')}}</h2>
        <p>{{$t('pages:faq.donation.text1')}}</p>

        <h2>{{$t('pages:faq.openSource.title')}}</h2>
        <p v-html="$t('pages:faq.openSource.text1')"></p>

    </div>
</template>

<script>
    import ConceptInfoDialog from '~/components/info/conceptInfo/ConceptInfoDialog';

    export default {
        components: {ConceptInfoDialog},
        data() {
            return {showConceptInfoDialog: false}
        },
        methods: {
            getUrl(url) {
                return `${process.env.staticUrl}/${url}`;
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        }
    }
</script>

<style lang="scss">
    #faq-description {
        @media screen and (max-width: $xs) {
            margin-top: 18px;
            padding: 0 16px;
        }

        h1 {
            font-size: 52px;
            line-height: 60px;
            color: #333;
            margin-bottom: 40px;
            @media screen and (max-width: $xs) {
                font-size: 28px;
                line-height: 34px;
                margin-bottom: 18px;
            }
        }

        h2 {
            font-size: 30px;
            line-height: 46px;
            color: #333;
            margin-top: 30px;
            margin-bottom: 20px;
            @media screen and (max-width: $xs) {
                font-size: 24px;
                line-height: 28px;
                margin-bottom: 14px;
            }
        }

        img {
            max-width: 450px;
            margin-bottom: 12px;
            @media screen and (max-width: $xs) {
                width: 100%;
            }
        }

        p {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }

        ul {
            font-weight: 300;
            font-size: 16px;
            line-height: 24px;
        }

        b {
            font-weight: 500;
        }

        .tour-button {
            margin-top: 14px;
            margin-left: 0;
        }

        .navigation-button {
            margin-top: 0;
            margin-left: 0;
        }
    }
</style>