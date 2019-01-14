<template>
    <div class="user-to-invite-to-answer-question">
        <v-checkbox v-model="sendMessageToUser" color="secondary"
                    :readonly="!user.sendingEmailAllowed || isReadOnly">
            <div slot="label">
                <div v-if="!user.userId" class="email-label">
                    {{user.email}}
                </div>
                <div v-else class="existing-user">
                    <div class="user-image">
                        <img :src="user.userImage"/>
                    </div>
                    <div class="user-content-container">
                        <div class="user-name">{{user.name}}</div>
                    </div>
                </div>
            </div>
        </v-checkbox>
    </div>
</template>

<script>

    export default {
        props: ['user', 'initSelection', 'isReadOnly'],
        data() {
            return {sendMessageToUser: this.initSelection, loading: false}
        },
        components: {},
        methods: {

        },
        computed: {

        },
        watch: {
            sendMessageToUser() {
                this.$emit('select-changed', this.user);
            }
        }
    }
</script>

<style lang="scss">
    .user-to-invite-to-answer-question {

        .email-label {
            margin-left: 12px;
        }

        .existing-user {
            display: flex;

            .user-image {
                height: 40px;
                width: 40px;
                margin-left: 12px;

                img {
                    height: 100%;
                    width: 100%;
                    border-radius: 4px;
                }
            }

            .user-content-container {
                margin-left: 12px;

                .user-name {
                    font-weight: 500;
                    line-height: 16px;
                    font-size: 16px;
                }
            }

        }

        .v-input--selection-controls {
            margin-top: 4px;

            .v-input__control {
                .v-input__slot {
                    margin-bottom: 0;
                }
            }
        }
    }
</style>
