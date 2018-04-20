<template>
    <div id="ely-footer">
        <div id="ely-footer-container">
            <div class="footer-nav">{{$t("pages:footer.vision")}}</div>
            <div class="footer-nav">{{$t("pages:footer.aboutUs")}}</div>
            <div class="footer-nav">{{$t("pages:footer.news")}}</div>
            <div class="footer-nav">{{$t("pages:footer.donate")}}</div>
            <div class="footer-nav" @click="$router.push({name: 'terms'})">{{$t("pages:footer.terms")}}</div>
            <div class="footer-nav">{{$t("pages:footer.privacy")}}</div>
            <div class="footer-nav">{{$t("pages:footer.contact")}}</div>
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
        clear: both;
        position: relative;
        z-index: 10;
        height: 48px;
        margin-top: -48px;
        background-color: #757575;
        left: 0;
        right: 0;
        #ely-footer-container {
            max-width: 950px;
            margin: 0 auto;
            padding: 0 8px;
            .footer-nav {
                display: inline-block;
                color: #ffffff;
                font-size: 14px;
                line-height: 14px;
                padding: 18px 0 16px 0;
                font-weight: 400;
                margin-right: 28px;
                cursor: pointer;
            }
            :hover.footer-nav {
                color: #B3E5FC;
            }
        }
    }
</style>