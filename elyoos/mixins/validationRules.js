export default {
    methods: {
        ruleFieldRequired(text) {
            return (v) => (typeof v === 'string' && v.trim()) !== '' || text;
        },
        ruleSelectRequired(text) {
            return (v) => !!v || text;
        },
        ruleSelectMultipleRequired(text) {
            return (v) => (v && v.length > 0) || text;
        },
        ruleToManyChars(text, length) {
            return (v) => (typeof v === 'string' && v.length <= length) || text;
        },
        ruleMinLength(text, minLength) {
            return (v) => (typeof v === 'string' && v.trim().length >= minLength) || text;
        },
        rulePasswordChars(text) {
            return (v) => (/(?=.*[A-Z])/.test(v) && /(?=.*[0-9])/.test(v)) || text;
        },
        rulePasswordEquals(text, password) {
            return (v) => v === password || text;
        },
        ruleIsEmail(text) {
            return (v) => /(.+)@(.+){2,}\.(.+){2,}/.test(v) || text;
        },
        isValidYoutubeLink() {
            return (v) => {
                if ((/youtu\.be/i.test(v) || /\.youtube\.com/i.test(v)) && /\/embed\//i.test(v)) {
                    return this.$t("validation:youtubeEmbedUrl")
                } else if (/\.youtube\.com/i.test(v) && !/v=/i.test(v)) {
                    return this.$t("validation:youtubeUrl");
                } else if (/youtu\.be/i.test(v) && !/youtu\.be\/[a-zA-Z0-9]{5,}/i.test(v)) {
                    return this.$t("validation:youtubeUrl");
                }
                return true;
            }
        }
    }
}