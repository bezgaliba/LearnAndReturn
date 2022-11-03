sap.ui.define([
    "./BaseController",
    "sap/ui/core/routing/History"
], function(BaseController, History) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.EditLearningObject", {
        onInit: function() {},
        onNavBack: function() {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("learningObjectList", {}, true);
            }
        },
    });
});