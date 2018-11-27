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
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="$emit('next')">
                {{$t("common:button.finish")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
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
            margin: 12px auto;
            @media screen and (max-width: $xs) {
                width: 300px;
            }
            @media screen and (max-width: 350px) {
                width: 280px;
            }
            img {
                width: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
