<template>
    <v-menu v-model="menu" :close-on-content-click="false" offset-y left max-height="400"
            class="select-trust-circle-filter-container">
        <v-icon slot="activator" :class="{'trust-circle-filter-active': trustCircle}">
            mdi-checkbox-blank-circle-outline
        </v-icon>
        <v-card class="select-trust-circle-filter-content" v-if="!showHelpTrustCircle">
            <div class="trust-circle-description" v-if="isAuthenticated">
                {{$t('pages:feeds.filter.trustCircle.descriptionFilterActivated')}}
                <span class="trust-circle-state" v-if="trustCircle === 0">{{$t('pages:feeds.filter.trustCircle.deactivated')}}</span>
                <span class="trust-circle-state" v-else>{{$t('pages:feeds.filter.trustCircle.activated')}}</span>
            </div>
            <div class="trust-circle-description" v-else>
                {{$t('pages:feeds.filter.trustCircle.descriptionNotLoggedIn')}}
            </div>
            <div class="trust-circle-commands">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="activateTrustCircleFilter" v-if="trustCircle === 0 || !isAuthenticated"
                       :disabled="!isAuthenticated">
                    {{$t('common:button.activate')}}
                </v-btn>
                <v-btn color="primary" @click="deactivateTrustCircleFilter" v-else>
                    <v-icon left>mdi-check</v-icon>
                    {{$t('common:button.activated')}}
                </v-btn>
            </div>
            <div class="help-link-trust-circle" @click="showHelpTrustCircle = true">Was ist ein Trust Circle?</div>
        </v-card>
        <v-card class="select-trust-circle-filter-content" v-else>
            <div class="trust-circle-description">
                {{$t('pages:feeds.filter.trustCircle.trustCircleHelp')}}
            </div>
            <div class="trust-circle-commands">
                <v-spacer></v-spacer>
                <v-btn color="primary" @click="showHelpTrustCircle = false">
                    {{$t('common:button.ok')}}
                </v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: ['trustCircle'],
        data: function () {
            return {
                menu: false, showHelpTrustCircle: false
            }
        },
        computed: {
            isAuthenticated() {
                return this.$store.state.auth.userIsAuthenticated
            }
        },
        methods: {
            activateTrustCircleFilter() {
                this.$store.commit('feedFilter/INCREASE_TRUST_CIRCLE_FILTER');
                this.$emit('trust-circle-changed');
            },
            deactivateTrustCircleFilter() {
                this.$store.commit('feedFilter/DEACTIVATE_TRUST_CIRCLE_FILTER');
                this.$emit('trust-circle-changed');
            }
        },
        watch: {
            menu(showMenu) {
                if (showMenu) {
                    this.showHelpTrustCircle = false;
                }
            }
        }
    }
</script>

<style lang="scss">
    .select-trust-circle-filter-container {
        i.icon.trust-circle-filter-active {
            color: $primary-color;
        }
    }

    .select-trust-circle-filter-content {
        padding: 16px;
        .trust-circle-commands {
            margin-top: 18px;
            display: flex;
            button {
                margin-right: 0;
            }
        }
        .trust-circle-description {
            max-width: 300px;
            font-size: 14px;
            .trust-circle-state {
                font-weight: 500;
            }
        }
        .help-link-trust-circle {
            cursor: pointer;
            font-size: 12px;
            color: $secondary-text;
            text-align: right;
        }
        .help-link-trust-circle:hover {
            text-decoration: underline;
        }
    }
</style>
