export default {
    methods: {
        getTopics() {
            return [{value: 'health', text: this.$t('common:topic.health')},
                {value: 'environmental', text: this.$t('common:topic.environmental')},
                {value: 'spiritual', text: this.$t('common:topic.spiritual')},
                {value: 'education', text: this.$t('common:topic.education')},
                {value: 'personalDevelopment', text: this.$t('common:topic.personalDevelopment')},
                {value: 'politics', text: this.$t('common:topic.politics')},
                {value: 'economy', text: this.$t('common:topic.economy')},
                {value: 'socialDevelopment', text: this.$t('common:topic.socialDevelopment')}];
        },
        getTopicText(topic) {
            return this.getTopics().find(t => topic === t.value).text;
        }
    }
}