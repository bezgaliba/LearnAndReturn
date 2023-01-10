//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Text",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/m/library"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, Text, Dialog, Button, MessageToast, mobileLibrary) {
    "use strict";

    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;

    return BaseController.extend("learnandreturn.controller.Worklist", {

        formatter: formatter,

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: async function() {
            // Tiek notīrīts vaicājumu vēsture
            this._aTableSearchState = [];
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0,
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
            });
            this.setModel(oViewModel, "worklistView");

            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRoutePatternMatched(this.onRefresh, this);

            // Tiek paslēpts UI elements lietotājiem ar lomu "Student"
            await this.enableUIElement('createCourse');
            await this.enableUIElement('deleteCourse');
            await this.enableUIElement('headerBtns');
            await this.enableUIElement('LOBtn');
            await this.enableUIElement('catBtn');

            this.setModel(this.oUserModel, "userModel");

            // Tiek paslēpts izdzēšanas atlasīšanas elements lietotājiem ar lomu "Student"
            if (this.oUserModel.getData().scopes.includes('Student')) {
                this.byId("courseTable").setProperty("mode", "None")
            }

            oViewModel.setProperty("/busy", false);
        },

        /**
         * KUR_503 “Kursu saraksta atjaunošana”
         * Funkcija automātiski atjaunina kursu sarakstu priekš jebkura lietotāja. Šī funkcija ir pakļauta citām funkcijām un nestrādā patstāvīgi.
         */
        onRefresh: function() {
            var oList = this.byId("courseTable"),
                oBindingList = oList.getBinding("items")
            oBindingList.refresh();
        },

        /**
         * Pārbauda, cik kursi ir pieejami kursa sarakstā un pielāgo to skaitu.
         */
        onUpdateFinished: function(oEvent) {
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Saistīt detalizēto skatu ar kursa objekta ID
         * @param {Object} oEvent - Atlasītais kurss
         */
        onPress: function(oEvent) {
            this._showObject(oEvent.getSource());
        },

        /**
         * Novirzīt priviliģēto lietotāju uz mācību moduļa saraksta skatu
         */
        onNavLO: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("learningObjectList", {});
        },

        /**
         * Novirzīt priviliģēto lietotāju uz kursa pievienošanas skatu
         */
        onNavCreate: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("addCourse", {});
        },

        /**
         * Novirzīt priviliģēto lietotāju uz kategoriju saraksta skatu
         */
        onNavCat: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("category", {});
        },

        /**
         * KUR_501 “Kursa filtrēšana”
         * Ļauj lietotājam ar lomu “Instructor” vai “Admin” filtrēt kursu pēc to nosaukuma sarakstā
         * @param {Object} oEvent - Meklētājrīka objekts
         */
        onSearch: function(oEvent) {
            if (oEvent.getParameters().refreshButtonPressed) {
                this.onRefresh();
            } else {
                var aTableSearchState = [];
                var sQuery = oEvent.getParameter("query");

                if (sQuery && sQuery.length > 0) {
                    aTableSearchState = [new Filter("CourseName", FilterOperator.Contains, sQuery)];
                }
                this._applySearch(aTableSearchState);
            }
        },

        /**
         * KUR_401 “Kursa noņemšana”
         * Funkcija ļauj lietotājam, kuram ir piešķirta loma “Instructor” vai “Admin”, noņemt kursa ierakstu.
         */
        deleteCourse: function() {
            var oSelected = this.byId("courseTable").getSelectedItem();
            if (oSelected) {
                oSelected.getBindingContext().delete("$auto").then(function() {
                    MessageToast.show(this._getText("deletemsg"));
                }.bind(this), function(oError) {
                    MessageBox.error(oError.message);
                });
            }
        },

        /**
         * KUR_401 “Kursa noņemšana” turp.
         * Dialoga loga izveide kā JSON modelis, ko uzbindo uz noklusēto skata modeli.
         */
        onDeleteConfirmation: function() {
            var oSelected = this.byId("courseTable").getSelectedItem();
            if (oSelected) {
                if (!this.oDefaultDialog) {
                    this.oDefaultDialog = new Dialog({
                        title: this.getView().getModel("i18n").getResourceBundle().getText("deleteConf"),

                        content: new Text({
                            text: this.getView().getModel("i18n").getResourceBundle().getText("deleteDesc")
                        }),
                        type: DialogType.Message,
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: this.getView().getModel("i18n").getResourceBundle().getText("cancelAction"),
                            press: function() {
                                this.byId("courseTable").removeSelections(true);
                                this.oDefaultDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            type: ButtonType.Emphasized,
                            text: this.getView().getModel("i18n").getResourceBundle().getText("confirmAction"),
                            press: function() {
                                this.oDefaultDialog.close()
                                var self = this;
                                self.deleteCourse();
                            }.bind(this)
                        }),
                    });

                    this.getView().addDependent(this.oDefaultDialog);
                }

                this.oDefaultDialog.open();
            } else {
                var sText = this.getView().getModel("i18n").getResourceBundle().getText("noItemSelected");
                MessageToast.show(sText);
            }
        },

        /**
         * Novirzīt lietotāju uz kursa detalizēto skatu, ņemot maršruta pattern no manifest.json
         * @param {Object} oItem - Atlasītais kurss
         */
        _showObject: function(oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },

        /**
         * KUR_501 “Kursa filtrēšana” turp.
         * Izsauc filter vaicājumu 
         * @param {Object} aTableSearchState - vaicājuma konstruktors
         */
        _applySearch: function(aTableSearchState) {
            this.byId('selectedCategory').setValue("")
            var oTable = this.byId("courseTable")
            var oViewModel = this.getModel("worklistView")
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("noSearchData"));
            }
            // Izsauc fn. KUR_503
            this.onRefresh()
        },

        /**
         * KUR_502 “Kursa atlasīšana”
         * Ļauj jebkuram lietotājam atlasīt kursu pēc kādas eksistējošas kursa kategorijas.
         */
        onLiveChange: function() {
            let sCourseCat = this.byId('selectedCategory').getSelectedKey(),
                oTable = this.byId("courseTable"),
                oFilter = sCourseCat ? new Filter('CourseCategory/ID', FilterOperator.EQ, sCourseCat) : null;
            this.byId('searchField').setValue("")
            oTable.getBinding("items").filter(oFilter);
            // Izsauc fn. KUR_503
            this.onRefresh()
        }
    });
});