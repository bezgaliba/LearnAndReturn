//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

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

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: async function() {
            // Iestata pabeigtības karogu kā 0 (Pārbaudes noklusējuma vērtība)
            this.iCompletionFlag = 0;
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.getRouter().getRoute("learningObject").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "learningObjectView")

            // Tiek paslēpts UI rediģēšanas elements lietotājiem ar lomu "Student"
            await this.enableUIElement('logsTab')
            await this.enableUIElement('listTab')
            await this.enableUIElement('editLO')
                // Tiek paslēpts UI rediģēšanas elements lietotājiem ar lomu "Instructor" vai "Admin"
            await this.enableCompletion('completionBtn')
            await this.enableCompletion('statusBtn')
            await this.enableCompletion('completionStatus')
        },

        /**
         * Saista detalizēto skatu ar mācību objekta ID, kas ir definēts manifest.json
         * * @param {Object} oEvent - Mācību moduļa objekts
         */
        _onObjectMatched: function(oEvent) {
            var sLearningObjectId = oEvent.getParameter("arguments").learningObjectId;
            this._bindView("/LearningObject" + sLearningObjectId);
        },

        /**
         * Saistīt skatu ar objekta ID
         * @param {String} sObjectPath - Servisa līmeņa entītija ar padoto mācību moduļa objekta ID
         */
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
         * Novirza lietotāju uz iepriekšējo skatu. Ja tāds nav definēts (skats sasniegts ar URL), tad uz lietotnes sākumskatu.
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
            // Iestatīt MAC_502 noklusētās vērtības
            this.byId("completionStatus").setText("")
            this.byId("completionStatus").setState("Warning")
            this.byId("completionStatus").setIcon("sap-icon://lateness")
        },


        /**
         * MAC_502 “Mācību moduļa statusa pārbaude”
         * Ļauj lietotājam ar lomu “Student” apskatīties savu apmācību statusu konkrētam mācību modulim.
         */
        submitStatus: function() {
            var bHasCompleted = this.byId("completionList").getAggregation("items").map(
                // Iterē cauri mācību moduļa pabeigtības sarakstam
                oEle => { return oEle.getProperty("title") }).findIndex(
                // Meklē, vai pabeigtības saraksta masīvā ir kāds ieraksts, kas ir identisks ar sesija lietotāja vārdu
                sEle => { return sEle === this.getView().getModel("userModel").getData().name }) !== -1;
            if (!bHasCompleted) {
                // Ja NAV atrasts kāds ieraksts, iestata attiecīgi UI elementus
                this.byId("completionStatus").setText("Pending")
                this.byId("completionStatus").setState("Error")
                this.byId("completionStatus").setIcon("sap-icon://sys-help-2")
            } else {
                // Ja IR atrasts kāds ieraksts, iestata attiecīgi UI elementus
                this.byId("completionStatus").setText("Completed")
                this.byId("completionStatus").setState("Success")
                this.byId("completionStatus").setIcon("sap-icon://sys-enter-2")
            }
            // Paziņojums GN003
            MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("learningObjectStatusCheck"));
        },

        /**
         * PAB_101 “Pabeigtības saraksta pievienošana”
         * Pēc mācību moduļu izveides tiek automātiski izveidots pabeigtības saraksts priekš katra mācību moduļa
         */
        onCompletion: function() {
            var bHasCompleted = this.byId("completionList").getAggregation("items").map(
                // T8 tests - Vai pabeigtības sarakstā ir kaut viens ieraksts ar sesijas lietotāja vārdu?
                oEle => { return oEle.getProperty("title") }).findIndex(
                sEle => { return sEle === this.getView().getModel("userModel").getData().name }) !== -1;
            if (!bHasCompleted) {
                // Ja nav, tad veido POST pieprasījumu
                var oListBinding = this.byId("completionList").getBinding("items");
                oListBinding.create({
                    up__ID: this.sModifiedObjectId
                }, false);
                this.onNavBack();
            } else {
                // Ja ir, tad neveido POST pieprasījumu un attēlo paziņojumu GN004
                var sText = this.getView().getModel("i18n").getResourceBundle().getText("learningObjectAlreadyCompleted");
                MessageToast.show(sText);
            }
        },

        /**
         * Novirzīt lietotāju uz mācību moduļa rediģēšanas skatu
         * @param {Object} oEvent - Mācību moduļa objekts
         */
        onEdit: function(oEvent) {
            this._showObject(oEvent.getSource())
        },

        /**
         * Novirzīt lietotāju uz mācību moduļa rediģēšanas skatu
         * @param {Object} oItem - Mācību moduļa objekta iestatījumi
         */
        _showObject: function(oItem) {
            this.getRouter().navTo("editLearningObject", {
                editLearningObjectId: oItem.getBindingContext().getPath().substring("/LearningObject".length)
            });
        },
    });
});