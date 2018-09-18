import Vue from 'vue';

const removeAllProperties = function (objectToRemoveProp) {
    for (let prop in objectToRemoveProp) {
        if (objectToRemoveProp.hasOwnProperty(prop)) {
            delete objectToRemoveProp[prop];
        }
    }
};

const addAllProperties = function (objectToAddProp, objectAddPropFrom) {
    for (let prop in objectAddPropFrom) {
        if (objectAddPropFrom.hasOwnProperty(prop)) {
            Vue.set(objectToAddProp, prop, objectAddPropFrom[prop])
        }
    }
};

export function replaceProperties(objectToAddProp, objectAddPropFrom) {
    removeAllProperties(objectToAddProp);
    addAllProperties(objectToAddProp, objectAddPropFrom)
};
