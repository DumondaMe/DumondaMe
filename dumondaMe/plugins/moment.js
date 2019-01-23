import Vue from 'vue';

import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import format from 'date-fns/format'
import isSameDay from 'date-fns/is_same_day'
import getTime from 'date-fns/get_time'

let locale = null;
let localeName = 'en';

const getOptions = function () {
    let options = {};
    if (locale) {
        options.locale = locale;
    }
    return options;
};

const getFormatDate = function (value) {
    if (value) {
        if (localeName === 'de') {
            return format(value * 1000, 'D. MMM YYYY', getOptions())
        } else if (localeName === 'en') {
            return format(value * 1000, 'MMM D, YYYY', getOptions())
        }
    }
};

const getFormatDateShort = function (value) {
    if (value) {
        let valueToConvert = value;
        if (typeof valueToConvert === 'string') {
            valueToConvert = getTime(value) / 1000;
        }
        if (localeName === 'de') {
            return format(valueToConvert * 1000, 'DD.MM.YYYY', getOptions())
        } else if (localeName === 'en') {
            return format(valueToConvert * 1000, 'MM/DD/YYYY', getOptions())
        }
    }
};

Vue.filter('formatRelativeTimesAgo', function (value) {
    if (value) {
        return distanceInWordsToNow(value * 1000, getOptions());
    }
});

Vue.filter('formatDateOnly', function (value) {
    return getFormatDate(value);
});

Vue.filter('getFormatDateOnlyShort', function (value) {
    return getFormatDateShort(value);
});


Vue.filter('formatFromToDate', function (startDate, endDate, atTranslation) {
    if (isSameDay(startDate * 1000, endDate * 1000)) {
        return `${getFormatDate(startDate)} ${atTranslation} 
                ${format(startDate * 1000, 'H:mm', getOptions())} - ${format(endDate * 1000, 'H:mm', getOptions())}`
    }
    return `${getFormatDate(startDate)} ${atTranslation} ${format(startDate * 1000, 'H:mm', getOptions())} 
              - ${getFormatDate(endDate)} ${atTranslation} ${format(startDate * 1000, 'H:mm', getOptions())} `
});

export default ({store}) => {
    if (store.state.i18n.language === 'de') {
        locale = require('date-fns/locale/de');
        localeName = 'de';
    }
}
