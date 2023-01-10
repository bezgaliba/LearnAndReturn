//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.NotFound", {

        // Novirza lietotāju uz kursa sarakstu jeb sākumskatu
        onLinkPressed: function() {
            this.getRouter().navTo("Home");
        }
    });
});