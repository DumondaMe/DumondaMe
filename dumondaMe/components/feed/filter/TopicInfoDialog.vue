<template>
    <v-dialog v-model="dialog" scrollable persistent max-width="250">
        <v-card id="dialog-select-topic-info">
            <v-card-text id="dialog-select-topic-info-content">
                <p>{{$t("pages:feeds.filter.topicInfo.info")}}</p>
                <div>
                    <v-btn color="primary" @click="goToTopic()" class="link-button">
                        {{$t("pages:feeds.filter.topicInfo.goToTopic")}}
                    </v-btn>
                </div>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="action-container">
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click.native="$emit('close-dialog')">
                    {{$t("common:button.close")}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        data() {
            return {dialog: true}
        },
        methods: {
            goToTopic() {
                this.$router.push({name: 'topics'});
                this.$emit('close-dialog');
            }
        }
    }
</script>

<style lang="scss">
    #dialog-select-topic-info {
        max-width: 250px;

        #dialog-select-topic-info-content {
            max-width: 250px;
            padding-top: 16px;

            p {
                font-size: 16px;
                font-weight: 300;
                text-align: center;
            }

            .link-button {
                width: 100%;
                margin: 6px auto 6px auto;
            }
        }
    }

    .v-dialog__container.dialog-login {
        .v-dialog {
            min-width: auto;
        }
    }
</style>
