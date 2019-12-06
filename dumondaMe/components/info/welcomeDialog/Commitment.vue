<template>
    <v-card id="welcome-commitment-container">
        <div>
            <slot name="header"></slot>
        </div>
        <v-card-text class="mobile-dialog-content">
            <div id="image-commitment-container">
                <img :src="imageUrl"/>
            </div>
            <div class="commitment-description" v-html="$t('dialog:welcome.stepCommitment.description')"></div>
            <div class="help-hint">{{$t("dialog:welcome.stepCommitment.hint")}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-btn color="primary" text @click="$emit('back')">
                {{$t("common:button.back")}}
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="$emit('close-dialog')">
                {{$t("common:button.later")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('next')">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/welcome/commitment.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    #welcome-commitment-container {

        .commitment-description {
            margin-top: 18px;
            font-weight: 300;
            font-size: 16px;
            b {
                font-weight: 500;
                color: $primary-color;
            }
        }

        .help-hint {
            margin-top: 12px;
            font-size: 16px;
            font-weight: 300;
            color: $secondary-color;
        }

        #image-commitment-container {
            width: 400px;
            min-height: 292px;
            margin: 12px auto;
            @media screen and (max-width: $xs) {
                min-height: 219px;
                width: 300px;
            }
            @media screen and (max-width: 350px) {
                min-height: 204px;
                width: 280px;
            }
            img {
                width: 100%;
                border-radius: 6px;
            }
        }
    }
</style>
