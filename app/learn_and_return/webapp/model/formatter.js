sap.ui.define([], function() {
    "use strict";

    return {

        /**
         * Pārveido atsauksmes vērtējuma indikatora skaitlisko vērtību uz UI ikonām atsauksmes vēstures sarakstā
         * Formatter metode tiek utilizēta skatā "Object"
         * @param {Integer} iValue - Vērtējuma indikators
         * @returns {String} - Zvaigžņu ikonas vēstures sarakstā
         */
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

        /**
         * Pārveido garo datuma/laika noformējumu uz īso
         * Formatter metode tiek utilizēta skatā "CourseMaterialList"
         * @param {Date} dDate - Padotais garais datuma formāts
         * @returns {String}  - Padotais īsā datuma formāts
         */
        shortDate: function(dDate) {
            var dNewDate = new Date(dDate);
            var sDateInfo = dNewDate.getDate() + '/' + (dNewDate.getMonth() + 1) + '/' + dNewDate.getFullYear();
            return sDateInfo
        },
    };
});