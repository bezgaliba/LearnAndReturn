//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
], function(BaseController, JSONModel, History, formatter, DateFormat, Filter, FilterOperator, Sorter) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.Object", {
        formatter: formatter,

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: async function() {
            // Iestatīt vērtējuma indikatoru ar pilnu zvaigžņu ikonu
            this.iRating = 5;
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");

            // Tiek paslēpts UI rediģēšanas elements lietotājiem ar lomu "Student"
            await this.enableUIElement('editCourse');
        },

        /**
         * Novirza lietotāju uz kursa saraksta skatu
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
         * Saista detalizēto skatu ar kursa objekta ID, kas ir definēts manifest.json
         * * @param {Object} oEvent - Kursa objekts
         */
        _onObjectMatched: function(oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            var sTempObjectId = sObjectId.replace('(', '');
            this.sModifiedObjectId = sTempObjectId.replace(')', '');
            this._bindView("/Course" + sObjectId);
        },

        /**
         * Saistīt skatu ar objekta ID
         * @param {String} sObjectPath - Servisa līmeņa entītija ar padoto kursa objekta ID
         */
        _bindView: function(sObjectPath) {
            var oViewModel = this.getModel("objectView");

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
         * ATS_101 “Atsauksmes pievienošana”
         * Funkcija ļauj sistēmas lietotājiem pievienot atsauksmi jebkuram kursam.
         * @param {Object} oEvent - Komentāra ievadlauks un to iestatījumi
         */
        onPost: function(oEvent) {
            var oListBinding = this.byId("reviewList").getBinding("items")
            oListBinding.create({
                up__ID: this.sModifiedObjectId,
                Comment: oEvent.getParameter("value"),
                ReviewIndicator: this.iRating,
            }, false);
            this.onRefresh()
        },

        /**
         * ATS_101 “Atsauksmes pievienošana”
         * Funkcija sistēmas lietotājiem automātiski atjaunina atsauksmju vēstures sarakstu pēc
         * atsauksmes pievienošanas. Šī funkcija ir pakļauta citai funkcijai un nestrādā patstāvīgi.
         */
        onRefresh: function() {
            var oCommentsList = this.byId("reviewList"),
                oBindingCommentsList = oCommentsList.getBinding("items")
            oBindingCommentsList.requestRefresh();
        },

        /**
         * Nolasa atsauksmes vērtējuma vērtību no zvaigznes ikona skaitu uz integer. 
         * setIndicator() metode tiek izmantota formatter modelī. Tiek izsaukta katru reizi lietotājs nomaina vērtējumu
         */
        setIndicator: function() {
            this.iRating = this.byId("ratingIndicator").getValue();
        },

        /**
         * Novirzīt lietotāju uz kursa rediģēšanas skatu
         * @param {Object} oEvent - Kursa objekts
         */
        onEdit: function(oEvent) {
            this._showEditableObject(oEvent.getSource())
        },


        /**
         * Novirzīt lietotāju uz kursa materiālu skatu
         * @param {Object} oEvent - Kursa objekts
         */
        onEnroll: function(oEvent) {
            this._showObject(oEvent.getSource());
        },

        /**
         * Novirzīt lietotāju uz kursa rediģēšanas skatu
         * @param {Object} oItem - Kursa objekta iestatījumi
         */
        _showEditableObject: function(oItem) {
            this.getRouter().navTo("editCourseObject", {
                editCourseObjectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },

        /**
         * Novirzīt lietotāju uz kursa materiālu skatu
         * @param {Object} oItem - Kursa objekta iestatījumi
         */
        _showObject: function(oItem) {
            this.getRouter().navTo("material", {
                materialObjectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },
    });
});