export default {
    methods: {
        getLanguages: function () {
            return [{value: 'de', text: 'Deutsch'},
                {value: 'en', text: 'English'}];
        },
        getLanguagesTranslated: function () {
            return [{value: 'de', text: this.$t('common:language.de')},
                {value: 'en', text: this.$t('common:language.en')}];
        },
        getLanguageTranslatedText(language) {
            return this.getLanguagesTranslated().find(l => language === l.value).text;
        }
    }
}