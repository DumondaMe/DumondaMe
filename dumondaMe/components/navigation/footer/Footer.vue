<template>
    <div id="ely-footer">
        <div id="ely-footer-container">
            <div class="footer-nav" @click="$router.push({name: 'vision'})">{{$t("pages:footer.vision")}}</div>
            <div class="footer-nav" @click="$router.push({name: 'aboutUs'})">{{$t("pages:footer.aboutUs")}}</div>
            <div class="footer-nav" @click="$router.push({name: 'contact'})">{{$t("pages:footer.contact")}}</div>
            <div class="footer-nav" @click="$router.push({name: 'donation'})">{{$t("pages:footer.donate")}}</div>
            <div class="footer-nav" @click="$router.push({name: 'terms'})">{{$t("pages:footer.terms")}}</div>
            <div class="footer-nav" @click="$router.push({name: 'privacy'})">{{$t("pages:footer.privacy")}}</div>
            <div class="footer-nav" @click="$router.push({name: 'faq'})">{{$t("pages:footer.faq")}}</div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style lang="scss">
    #ely-footer {
        z-index: 7;
        height: 48px;
        background-color: $primary-color;

        @media screen and (max-width: 800px) {
            height: 96px;
        }
        @media screen and (max-width: 380px) {
            height: 144px;
        }

        #ely-footer-container {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
            padding: 0 8px;
            text-align: center;
            .footer-nav {
                display: inline-block;
                color: #ffffff;
                font-size: 14px;
                line-height: 48px;
                //padding: 18px 0 16px 0;
                font-weight: 400;
                margin-right: 14px;
                margin-left: 14px;
                cursor: pointer;
            }
            :hover.footer-nav {
                color: #B3E5FC;
            }
        }
    }
</style>