sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function(BaseController, JSONModel, History) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.EditLearningObject", {

        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.getRouter().getRoute("editLearningObject").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("editLearningObject").attachPatternMatched(this.studentCheck, this);
            this.setModel(oViewModel, "editLearningObjectView");
        },

        _onObjectMatched: function(oEvent) {
            var sEditableLearningObjectId = oEvent.getParameter("arguments").editLearningObjectId;
            this._bindView("/LearningObject" + sEditableLearningObjectId);
        },

        _bindView: function(sEditableLearningObjectPath) {
            var oViewModel = this.getModel("editLearningObjectView");
            this.getView().bindElement({
                path: sEditableLearningObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function() {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function() {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange: function() {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }
        },

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