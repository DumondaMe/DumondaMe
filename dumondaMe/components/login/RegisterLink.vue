<template>
    <div id="dumonda-me-register-link">
        <div id="register-container">
            <h2>{{$t("pages:login.titleRegister")}}</h2>
            <v-btn color="secondary" @click="$router.push({name: 'register'})">{{$t("pages:login.registerLink")}}</v-btn>
        </div>
    </div>
</template>

<style lang="scss">
    #dumonda-me-register-link {
        padding: 16px;
        #register-container {
            width: 300px;

            @media screen and (max-width: $sm) {
                margin: 80px auto;
            }
            h2 {
                font-size: 24px;
                font-weight: 400;
                margin-top: 14px;
                margin-bottom: 12px;
            }
        }
    }
</style>
