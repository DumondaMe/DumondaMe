<template>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="280" min-width="290" offset-y>
        <slot name="icon" slot="activator"></slot>
        <v-card class="ely-menu-container ely-menu-region" v-if="menu">
            <div class="menu-title">
                {{$t('pages:feeds.menu.regions.title')}}
            </div>
            <div class="menu-content menu-region-content">
                <div v-for="region in regions" class="region">{{region}}</div>
            </div>
            <v-divider></v-divider>
            <div class="menu-commands">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: ['regions'],
        data() {
            return {menu: false}
        },
        methods: {
            goToProfile() {
                if (this.isLoggedInUser) {
                    this.$router.push({name: 'user'});
                } else {
                    this.$router.push({name: 'user-userId-slug', params: {userId: this.userId, slug: this.userSlug}})
                }
            },
            async addUserToTrustCircle() {
                await this.$axios.$post(`user/trustCircle/${this.userId}`);
                this.$emit('add-trust-circle', this.userId);
            },
            async removeUserFromTrustCircle() {
                await this.$axios.$delete(`user/trustCircle/${this.userId}`);
                this.$emit('remove-trust-circle', this.userId);
            }
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.ely-menu-region {
        .menu-region-content {
            .region {
                font-size: 14px;
                font-weight: 400;
                margin-bottom: 4px;
            }
        }
    }
</style>