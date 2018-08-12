<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" scrollable persistent max-width="450px">
            <v-card id="dialog-edit-trust-circle-filter">
                <div>
                    <div id="elyoos-dialog-header">
                        Trust Circle Filter Einstellungen
                    </div>
                    <v-divider></v-divider>
                </div>
                <v-card-text id="dialog-create-region-commitment-content">

                    <div class="description">Wenn der Trust Circle Filter aktiv ist siehst du nur die
                        Beiträge/Aktivitäten, welche von Personen stammen die du deinem Trust Circel hinzugefügt hast.
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" flat @click.native="$emit('close-dialog')">
                        {{$t("common:button.abort")}}
                    </v-btn>
                    <v-btn color="primary" @click.native="$emit('close-dialog')" :loading="loading"
                           :disabled="loading">
                        Aktivieren
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar top v-model="showError" color="error" :timeout="0">{{$t("common:error.unknown")}}
            <v-btn dark flat @click="showError = false">{{$t("common:button.close")}}</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
    export default {
        props: [],
        data() {
            return {dialog: true, loading: false, showError: false}
        },
        methods: {}
    }
</script>

<style lang="scss">

</style>
