<template>
    <v-card id="welcome-trust-circle-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div id="image-trust-circle-container">
                <img :src="imageUrl"/>
            </div>
            <div class="trust-circle-description" v-html="$t('dialog:welcome.stepTrustCircle.description')"></div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="primary" flat @click="$emit('back')">
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
                return `${process.env.staticUrl}/img/welcome/trustCircle.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    #welcome-trust-circle-container {

        .trust-circle-description {
            margin-top: 18px;
            font-weight: 300;

            b {
                font-weight: 500;
                color: $primary-color;
            }
        }

        .help-hint {
            margin-top: 12px;
            color: $secondary-color;
            border-left: 2px solid $secondary-color;
            padding-left: 12px;
        }

        #image-trust-circle-container {
            width: 400px;
            min-height: 295px;
            margin: 12px auto;
            @media screen and (max-width: $xs) {
                width: 300px;
                min-height: 222px;
            }
            @media screen and (max-width: 350px) {
                min-height: 207px;
                width: 280px;
            }

            img {
                width: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
