<template>
    <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="280" min-width="290" offset-y>
        <template v-slot:activator="{ on }">
            <div v-on="on">
                <slot name="icon"></slot>
            </div>
        </template>
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
                <v-btn text color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: ['regions'],
        data() {
            return {menu: false}
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