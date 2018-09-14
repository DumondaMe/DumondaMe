<template>
    <v-menu v-model="menu" :close-on-content-click="false" offset-y>
        <slot name="icon" slot="activator"></slot>
        <v-card class="ely-menu-container ely-menu-suggestion">
            <div class="menu-title">
                {{$t('pages:detailQuestion.menu.suggestion.title')}}
            </div>
            <div class="menu-content menu-suggestion-content">
                <div class="no-suggestion">
                    {{$t('pages:detailQuestion.menu.suggestion.noSuggestion')}}
                </div>
            </div>
            <v-divider></v-divider>
            <div class="menu-commands">
                <v-spacer></v-spacer>
                <v-btn flat color="primary" @click="menu = false">{{$t('common:button.close')}}</v-btn>
                <v-btn color="primary" :disabled="isAdmin" @click="addWatch()">
                    <v-icon left>mdi-wrench</v-icon>
                    {{$t('pages:detailQuestion.menu.suggestion.addButton')}}
                </v-btn>
            </div>
        </v-card>
    </v-menu>
</template>

<script>
    export default {
        props: ['numberOfSuggestion', 'isAdmin', 'isSuperUser'],
        data() {
            return {menu: false}
        },
        methods: {
        }
    }
</script>

<style lang="scss">
    .ely-menu-container.ely-menu-suggestion {
        .menu-suggestion-content {

        }
    }
</style>