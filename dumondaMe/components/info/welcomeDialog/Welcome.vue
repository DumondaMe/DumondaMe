<template>
    <v-card id="welcome-container">
        <v-card-text class="mobile-dialog-content">
            <div id="welcome-title">{{$t("dialog:welcome.stepWelcome.title")}}</div>
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
                return `${process.env.staticUrl}/img/welcome/welcome.jpg`;
            }
        }
    }
</script>

<style lang="scss">
    #welcome-container {
        #welcome-title {
            text-align: center;
            font-size: 28px;
            color: $primary-color;
        }

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
