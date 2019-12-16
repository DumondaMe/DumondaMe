<template>
    <v-card id="welcome-actions-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div id="image-actions-container">
                <img :src="imageUrl"/>
            </div>
            <div>
                <span class="trust-actions-description" v-html="$t('dialog:welcome.stepActions.description')">
                </span>
            </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="primary" text @click="$emit('back')">
                {{$t("common:button.back")}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="$emit('next')" :loading="loading" :disabled="loading">
                {{$t("common:button.finish")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ['loading'],
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/welcome/action.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    #welcome-actions-container {

        .trust-actions-description {
            margin-top: 18px;
            font-weight: 300;
            font-size: 16px;
            color: $primary-text;

            b {
                font-weight: 500;
                color: $primary-color;
            }
        }

        i {
            margin: 0 4px;
        }

        #image-actions-container {
            width: 400px;
            min-height: 252px;
            margin: 12px auto;
            @media screen and (max-width: $xs) {
                width: 300px;
                min-height: 189px;
            }
            @media screen and (max-width: 350px) {
                min-height: 176px;
                width: 280px;
            }

            img {
                width: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
