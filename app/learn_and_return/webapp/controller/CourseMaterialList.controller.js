sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel"
], function(BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.CourseMaterialList", {
        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("material").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "materialView");
        },
        _onObjectMatched: function(oEvent) {
            var sObjectId = oEvent.getParameter("arguments").materialObjectId;
            this._bindView("/Course" + sObjectId);
        },
        _bindView: function(sMaterialPath) {
            var oViewModel = this.getModel("materialView");
            this.getView().bindElement({
                path: sMaterialPath,
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
        onNavLOObject: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Home", {});
        }
    });
});