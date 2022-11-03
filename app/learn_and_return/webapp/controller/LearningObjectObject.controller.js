sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.LearningObjectObject", {

        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("learningObject").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "learningObjectView");
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
        onNavLOList: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("learningObjectList", {});
        },

        onEdit: function(oEvent) {
            this._showObject(oEvent.getSource())
        },


        _showObject: function(oItem) {
            this.getRouter().navTo("editLearningObject", {
                editLearningObjectId: oItem.getBindingContext().getPath().substring("/LearningObject".length)
            });
        },

        onEditv2: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("editLearningObject", {});
        },
    });
});