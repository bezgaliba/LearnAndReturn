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
        shortDate: function(dDate) {
            var dNewDate = new Date(dDate);
            var oDateInfo = "Last modified: " + dNewDate.getDate() + '/' + (dNewDate.getMonth() + 1) + '/' + dNewDate.getFullYear();
            return oDateInfo
        },
    };
});