sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, mobileLibrary, JSONModel) {
    "use strict";

    return Controller.extend("learnandreturn.controller.BaseController", {

        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },

        getModel: function(sName) {
            return this.getView().getModel(sName);
        },

        setModel: function(oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        studentCheck: async function() {
            this.oUserModel = new JSONModel();
            await this.oUserModel.loadData("/user-api/attributes")
            if (this.oUserModel.getData().scopes.includes('Student')) {
                this.getRouter().getTargets().display("objectNotFound");
            }
        },

        enableUIElement: async function(sID) {
            this.oUserModel = new JSONModel();
            await this.oUserModel.loadData("/user-api/attributes")
            this.getView().setModel(this.oUserModel, "userModel")
            if (!this.oUserModel.getData().scopes.includes('Student')) {
                this.getView().byId(sID).setVisible(true)
            }
        },
    });
});