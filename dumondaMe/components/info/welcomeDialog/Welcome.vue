<template>
    <v-card id="welcome-container">
        <v-card-text class="mobile-dialog-content">
            <div id="welcome-dialog-title">{{$t("dialog:welcome.stepWelcome.title")}}</div>
            <div id="welcome-title-image-container">
                <img :src="imageUrl"/>
            </div>
            <div class="welcome-description">{{$t("dialog:welcome.stepWelcome.description")}}</div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat @click="$emit('close-dialog')">
                {{$t("common:button.close")}}
            </v-btn>
            <v-btn color="primary" @click="$emit('next')" :disabled="loading" :loading="loading">
                {{$t("common:button.next")}}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ['loading'],
        computed: {
            imageUrl() {
                return `${process.env.staticUrl}/img/welcome/welcome.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    #welcome-container {

        #welcome-title-image-container {
            width: 300px;
            margin: 12px auto;

            img {
                width: 100%;
                border-radius: 6px;
            }
        }

        .welcome-description {
            text-align: center;
            font-weight: 300;
            max-width: 550px;
            margin: 0 auto;
        }
    }
</style>
