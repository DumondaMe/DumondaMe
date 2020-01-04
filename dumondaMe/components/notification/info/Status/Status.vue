<template>
    <div class="minor-challenges-container">
        <challenge-item v-for="index in totalNumberOfSuccess" :number-of-success="numberOfSuccess"
                              :trigger="index - 1" :key="index">
        </challenge-item>
        <div class="check-list-button">
            <v-menu open-on-hover offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn text icon v-on="on"
                           :class="{'success-challenge-icon': numberOfSuccess === totalNumberOfSuccess}">
                        <v-icon size="28">{{$icons.mdiCheckCircleOutline}}</v-icon>
                    </v-btn>
                </template>
                <v-card class="challenge-checklist-card">
                    <div class="checklist-title">
                        {{$t('pages:notifications.challengeStatus.minor.title')}}
                    </div>
                    <div class="checklist-container">
                        <check-list-item :challenge-status="challengeStatus" prop-name="createAccount">
                        </check-list-item>
                        <check-list-item :challenge-status="challengeStatus" prop-name="watchQuestion">
                        </check-list-item>
                        <check-list-item :challenge-status="challengeStatus" prop-name="watchCommitment">
                        </check-list-item>
                        <check-list-item :challenge-status="challengeStatus" prop-name="likeAnswer">
                        </check-list-item>
                        <check-list-item :challenge-status="challengeStatus" prop-name="addedPersonToTrustCircle">
                        </check-list-item>
                        <check-list-item :challenge-status="challengeStatus" prop-name="createdQuestion">
                        </check-list-item>
                        <check-list-item :challenge-status="challengeStatus" prop-name="createdCommitment">
                        </check-list-item>
                        <check-list-item :challenge-status="challengeStatus" prop-name="createdAnswer">
                        </check-list-item>
                    </div>
                </v-card>
            </v-menu>
        </div>
    </div>
</template>

<script>
    import ChallengeItem from "./ChallengeItem";
    import CheckListItem from "./CheckListItem";
    import {mdiCheckCircleOutline} from "@mdi/js";

    export default {
        props: ['challengeStatus'],
        components: {ChallengeItem, CheckListItem},
        created() {
            this.$icons = {mdiCheckCircleOutline}
        },
        computed: {
            numberOfSuccess() {
                let number = 0;
                for (let status in this.challengeStatus) {
                    if (this.challengeStatus.hasOwnProperty(status) && this.challengeStatus[status] === true) {
                        number++;
                    }
                }
                return number;
            },
            totalNumberOfSuccess() {
                let number = 0;
                for (let status in this.challengeStatus) {
                    if (this.challengeStatus.hasOwnProperty(status)) {
                        number++;
                    }
                }
                return number;
            }
        }
    }
</script>

<style lang="scss">
    .minor-challenges-container {
        position: relative;
        width: 100%;
        display: flex;
        @include defaultPaddingCard();
        margin-bottom: 4px;

        .check-list-button {
            position: absolute;
            right: 5px;
            top: -14px;
            background: white;

            .success-challenge-icon {
                .v-icon {
                    color: $success-text;
                }
            }
        }
    }

    .challenge-checklist-card {
        padding: 16px;

        .checklist-title {
            font-size: 18px;
            font-weight: 500;
        }

        .checklist-container {
            padding-top: 14px;
        }
    }
</style>