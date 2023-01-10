//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/m/library",
    "sap/ui/model/json/JSONModel"
], function(Controller, UIComponent, mobileLibrary, JSONModel) {
    "use strict";

    return Controller.extend("learnandreturn.controller.BaseController", {

        /**
         * Definēt maršruta iegūšanas metodi
         * @return {sap.ui.core.routing.Router} - maršruts, kas atsaucas uz manifest.json
         */
        getRouter: function() {
            return UIComponent.getRouterFor(this);
        },

        /**
         * Modeļa iegūšanas metodi
         * @param {String} sName - modeļa nosaukums
         * @return {Object} - modeļa instance
         */
        getModel: function(sName) {
            return this.getView().getModel(sName);
        },

        /**
         * Modeļa iestatīšanas metode
         * @param {Object} oModel - JSON modelis
         * @param {String} sName - modeļa piešķirtais nosaukums
         * @return {Object} - modeļa instance
         */
        setModel: function(oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

        /**
         * Iegūt tulka modeļa 'i18n' datus/resursus
         * @return {Object} - komponentes 'i18n' resursi
         */
        getResourceBundle: function() {
            return this.getOwnerComponent().getModel("i18n").getResourceBundle();
        },

        /** 
         * Nodrošina lietotājam izrakstīties no L&R sistēmas
         */
        studentCheck: async function() {
            this.oUserModel = new JSONModel();
            await this.oUserModel.loadData("/user-api/attributes")
            if (this.oUserModel.getData().scopes.includes('Student')) {
                this.getRouter().getTargets().display("objectNotFound");
            }
        },

        /**
         * Pārbauda, vai lietotājs ar lomu "Student" mēģina sasniegt priviliģēto lietotāja skatu.
         * @param {*} sID - Skata elementa atribūta 'id' vērtība
         */
        enableUIElement: async function(sID) {
            this.oUserModel = new JSONModel();
            await this.oUserModel.loadData("/user-api/attributes")
            this.getView().setModel(this.oUserModel, "userModel")
            if (!this.oUserModel.getData().scopes.includes('Student')) {
                this.getView().byId(sID).setVisible(true)
            }
        },

        /**
         * Pārbauda, vai lietotājs ar lomu "Admin" vai "Instructor" un attēlo attiecīgus UI elementus.
         * @param {*} sID - Skata elementa atribūta 'id' vērtība
         */
        enableCompletion: async function(sID) {
            this.oUserModel = new JSONModel();
            await this.oUserModel.loadData("/user-api/attributes")
            this.getView().setModel(this.oUserModel, "userModel")
            if (!this.oUserModel.getData().scopes.includes('Admin') && !this.oUserModel.getData().scopes.includes('Instructor')) {
                this.getView().byId(sID).setVisible(true)
            }
        }
    });
});