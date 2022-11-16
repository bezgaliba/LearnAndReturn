sap.ui.define([], function() {
    "use strict";

    return {


        numberUnit: function(sValue) {
            if (!sValue) {
                return "";
            }
            return parseFloat(sValue).toFixed(2);
        },


        intToStars: function(iValue) {
            if (iValue == 0) {
                return "☆";
            } else if (iValue == 1) {
                return "★";
            } else if (iValue == 2) {
                return "★★";
            } else if (iValue == 3) {
                return "★★★";
            } else if (iValue == 4) {
                return "★★★★";
            } else if (iValue == 5) {
                return "★★★★★";
            }
        },

        isCompleted: function(sUser) {
            return this.byId("completionList").getAggregation("items")?.map(oEle => { return oEle.getProperty("title") }).findIndex(sEle => { return sEle === sUser }) !== -1
        }
    };
});