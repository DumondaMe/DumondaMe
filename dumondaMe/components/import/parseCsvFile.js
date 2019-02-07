const emailValidator = require("email-validator");

const emailHasNotBeenAddedToCollection = function (emails, element) {
    return emails.findIndex(email => email === element) === -1;
};


export default {
    parseEmails: function (text) {
        const emails = [];
        if (typeof text === 'string') {
            let elements = text.split(',');
            for (let element of elements) {
                element = element.trim();
                if (element.length > 4 && emailValidator.validate(element)) {
                    element = element.toLowerCase();
                    if (emailHasNotBeenAddedToCollection(emails, element)) {
                        emails.push({email: element, source: 'CSV'});
                    }
                }
            }
        }
        return emails;
    }
}