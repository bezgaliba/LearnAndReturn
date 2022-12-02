sap.ui.define([
    "./BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.NotFound", {

        onLinkPressed: function() {
            this.getRouter().navTo("Home");
        }
    });
});