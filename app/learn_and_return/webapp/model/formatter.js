sap.ui.define([], function() {
    "use strict";

    return {

        /**
         * Rounds the number unit value to 2 digits
         * @public
         * @param {string} sValue the number string to be rounded
         * @returns {string} sValue with 2 digits rounded
         */
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
        }
    };
});