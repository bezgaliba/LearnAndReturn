sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/core/routing/History"
], function(BaseController, JSONModel, formatter, History) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.LearningObjectObject", {

        formatter: formatter,

        onInit: async function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            var oUserModel = new JSONModel();
            await oUserModel.loadData("/user-api/attributes")
            this.getRouter().getRoute("learningObject").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "learningObjectView");
            this.getView().setModel(oUserModel, "userModel")
            console.log("init end")
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
        },

        onCompletion: function() {
            var bHascompleted = this.byId("completionList").getAggregation("items").map(
                oEle => { return oEle.getProperty("title") }).findIndex(
                sEle => { return sEle === this.getView().getModel("userModel").getData().name }) !== -1;
            if (!bHascompleted) {
                var oListBinding = this.byId("completionList").getBinding("items");
                oListBinding.create({
                    up__ID: this.sModifiedObjectId
                }, false);
            } else {
                console.log("uve completed")
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