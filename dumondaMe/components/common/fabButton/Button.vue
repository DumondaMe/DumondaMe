<template>
    <div id="dumonda-me-fab-button-container" v-show="$vuetify.breakpoint.width <= showButtonBreakpoint">
        <v-btn :fab="$vuetify.breakpoint.width < 700" :rounded="$vuetify.breakpoint.width >= 700"
               color="dumonda-me-fab-button-color" dark
               class="dumonda-me-fab-button" @click="openCreateDialog">
            <v-icon>{{fabIcon}}</v-icon>
            <span class="fab-text" v-show="$vuetify.breakpoint.width >= 700">{{buttonLabel}}</span>
        </v-btn>

        <login-required-dialog v-if="showLoginRequired" @close-dialog="showLoginRequired = false">
        </login-required-dialog>
    </div>
</template>

<script>
    import LoginRequiredDialog from '~/components/common/dialog/LoginRequired';

    export default {
        props: ['buttonLabel', 'fabIcon', 'showButtonBreakpoint'],
        components: {LoginRequiredDialog},
        data() {
            return {showLoginRequired: false};
        },
        methods: {
            openCreateDialog() {
                if (this.$store.state.auth.userIsAuthenticated) {
                    this.$emit('show-create-dialog');
                } else {
                    this.showLoginRequired = true;
                }
            }
        }
    }
</script>

<style lang="scss">
    #dumonda-me-fab-button-container {

        .dumonda-me-fab-button {
            position: fixed;
            right: 18px;
            bottom: 72px;

            .fab-text {
                margin-left: 8px;
            }
        }

        .dumonda-me-fab-button-color {
            background-color: #4caf50;
        }
    }
</style>