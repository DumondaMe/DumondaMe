<template>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="280" min-width="290" offset-y
            open-on-hover open-delay="700" offset-overflow>
        <template v-slot:activator="{ on }">
            <div v-on="on" @click="goToCommitment()">
                <slot name="icon"></slot>
            </div>
        </template>
        <v-card class="ely-menu-container" v-if="menu">
            <div class="menu-title"><span class="primary-title">{{commitment}}</span> {{menuTitle}}
            </div>
            <div class="menu-content menu-commitment-content">
                <div class="commitment-image">
                    <img :src="commitmentImage" @click="goToCommitment()">
                </div>
                <div class="commitment-description">
                    {{description}}
                </div>
            </div>
            <v-divider></v-divider>
            <div class="menu-commands">
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: ['menuTitle', 'commitment', 'description', 'commitmentId', 'commitmentSlug', 'commitmentImage'],
        data() {
            return {menu: false}
        },
        methods: {
            goToCommitment() {
                this.$router.push({
                    name: 'commitment-commitmentId-slug',
                    params: {commitmentId: this.commitmentId, slug: this.commitmentSlug}
                })
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container {
        .menu-commitment-content {
            display: flex;

            .commitment-image {
                position: relative;
                width: 100px;
                height: 100px;

                img {
                    cursor: pointer;
                    z-index: 0;
                    width: 100%;
                    border-radius: 4px;
                }
            }

            .commitment-description {
                font-size: 14px;
                max-height: 200px;
                max-width: 250px;
                padding: 0 16px;
                overflow: hidden;
            }
        }
    }
</style>