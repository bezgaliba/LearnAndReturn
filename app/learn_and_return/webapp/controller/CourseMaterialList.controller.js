//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
], function(BaseController, JSONModel, History, formatter) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.CourseMaterialList", {

        formatter: formatter,

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("material").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "materialView");
        },

        /**
         * Saistīt skatu ar objekta ID, kas ir definēts manifest.json
         * @param {Object} oEvent - Uzspiestā objekta ieraksts
         */
        _onObjectMatched: function(oEvent) {
            var sObjectId = oEvent.getParameter("arguments").materialObjectId;
            this._bindView("/Course" + sObjectId);
        },

        /**
         * Saistīt skatu ar objekta ID
         * @param {String} sMaterialPath - Servisa līmeņa entītija ar padoto objekta ID
         */
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

        /**
         * Pārbauda, vai padotais URL pattern ir valid (vai eksistē objekts)
         */
        _onBindingChange: function() {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }
        },

        /**
         * Novirza lietotāju uz iepriekšējo skatu - kursa detalizēto skatu. Ja sasniegts caur URL patstāvīgi, tad "Go Back"
         * novirzīs lietotāju uz sākumskatu
         */
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

        /**
         * Saistīt detalizēto skatu ar mācību moduļa objekta ID
         * @param {Object} oEvent - Atlasītais kurss
         */
        onPress: function(oEvent) {
            var sPath = "(" + oEvent.getSource().getBindingContext().getValue().LearningObject.ID + ")";
            this.routeLO(sPath);
        },

        /**
         * Novirza lietotāju uz mācību moduļa detalizēto skatu
         */
        routeLO: function(sPath) {
            this.getRouter().navTo("learningObject", {
                learningObjectId: sPath
            });
        },
    });
});