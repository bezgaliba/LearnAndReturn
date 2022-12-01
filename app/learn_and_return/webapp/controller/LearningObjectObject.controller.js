sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast"
], function(BaseController, JSONModel, formatter, History, MessageToast) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.LearningObjectObject", {

        formatter: formatter,

        onInit: async function() {
            this.iCompletionFlag = 0;
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.getRouter().getRoute("learningObject").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "learningObjectView");

            await this.enableUIElement('logsTab');
            await this.enableUIElement('listTab');
        },

        _onObjectMatched: function(oEvent) {
            var sLearningObjectId = oEvent.getParameter("arguments").learningObjectId;
            this._bindView("/LearningObject" + sLearningObjectId);
        },

        _bindView: function(sObjectPath) {
            var oViewModel = this.getModel("learningObjectView");
            this.getView().bindElement({
                path: sObjectPath,
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
                oRouter.navTo("Home", {}, true);
            }
            this.byId("completionStatus").setText("")
            this.byId("completionStatus").setState("Warning")
            this.byId("completionStatus").setIcon("sap-icon://lateness")
        },

        submitStatus: function() {
            var bHasCompleted = this.byId("completionList").getAggregation("items").map(
                oEle => { return oEle.getProperty("title") }).findIndex(
                sEle => { return sEle === this.getView().getModel("userModel").getData().name }) !== -1;
            if (!bHasCompleted) {
                this.byId("completionStatus").setText("Pending")
                this.byId("completionStatus").setState("Error")
                this.byId("completionStatus").setIcon("sap-icon://sys-help-2")
            } else {
                this.byId("completionStatus").setText("Completed")
                this.byId("completionStatus").setState("Success")
                this.byId("completionStatus").setIcon("sap-icon://sys-enter-2")
            }
            MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("learningObjectStatusCheck"));
        },

        onCompletion: function() {
            var bHasCompleted = this.byId("completionList").getAggregation("items").map(
                oEle => { return oEle.getProperty("title") }).findIndex(
                sEle => { return sEle === this.getView().getModel("userModel").getData().name }) !== -1;
            if (!bHasCompleted) {
                var oListBinding = this.byId("completionList").getBinding("items");
                oListBinding.create({
                    up__ID: this.sModifiedObjectId
                }, false);
                this.onNavBack();
            } else {
                var sText = this.getView().getModel("i18n").getResourceBundle().getText("learningObjectAlreadyCompleted");
                MessageToast.show(sText);
            }
        },

        onEdit: function(oEvent) {
            this._showObject(oEvent.getSource())
        },

        _showObject: function(oItem) {
            this.getRouter().navTo("editLearningObject", {
                editLearningObjectId: oItem.getBindingContext().getPath().substring("/LearningObject".length)
            });
        },
    });
});