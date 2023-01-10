//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast",
    "sap/m/Text",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library",
    "sap/m/MessageBox"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, MessageToast, Text, Dialog, Button, mobileLibrary, MessageBox) {
    "use strict";

    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;

    return BaseController.extend("learnandreturn.controller.LearningObjectList", {

        formatter: formatter,
        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: function() {
            this.getRouter().getRoute("learningObjectList").attachPatternMatched(this.studentCheck, this);
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRoutePatternMatched(this.onRefresh, this);
        },

        /**
         * MAC_503 “Mācību moduļa sarakstu atjaunošana”
         * Automātiski atjaunina kategoriju sarakstu. Šī funkcija ir pakļauta citām funkcijām un nestrādā patstāvīgi.
         */
        onRefresh: function() {
            var oList = this.byId("learningObjectList");
            var oBinding = oList.getBinding("items");
            oBinding.refresh();
        },

        /**
         * MAC_501 “Mācību moduļa filtrēšana”
         * Ļauj lietotājam ar lomu “Instructor” vai “Admin” filtrēt mācību moduļus pēc to nosaukuma sarakstā.
         * @param {Object} oEvent - Meklētājrīka objekts
         */
        onSearch: function(oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("Name", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
            var oList = this.byId("learningObjectList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        /**
         * Novirza lietotāju uz kursa sarakstu jeb sākumskatu
         */
        onNavHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Home", {});
        },

        /**
         * Novirza lietotāju uz mācību objekta pievienošanas skatu
         */
        onNavCreate: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("addLearningObject", {});
        },

        /**
         * MAC _401 “Mācību moduļa noņemšana”
         * Funkcija ļauj lietotājam, kuram ir piešķirta loma “Instructor” vai “Admin”, noņemt mācību moduļa ierakstu.
         */
        deleteLearningObject: function() {
            var oSelected = this.byId("learningObjectList").getSelectedItem();
            if (oSelected) {
                oSelected.getBindingContext().delete("$auto").then(function() {
                    MessageToast.show(this._getText("deletemsg"));
                }.bind(this), function(oError) {
                    MessageBox.error(oError.message);
                });
            }
        },

        /**
         * MAC _401 “Mācību moduļa noņemšana” turp.
         * Dialoga loga izveide kā JSON modelis, ko uzbindo uz noklusēto skata modeli.
         */
        onDeleteConfirmation: function() {
            var oSelected = this.byId("learningObjectList").getSelectedItem();
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
                                this.byId("learningObjectList").removeSelections(true);
                                this.oDefaultDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            type: ButtonType.Emphasized,
                            text: this.getView().getModel("i18n").getResourceBundle().getText("confirmAction"),
                            press: function() {
                                this.oDefaultDialog.close()
                                var self = this;
                                self.deleteLearningObject();
                            }.bind(this)
                        }),
                    });

                    this.getView().addDependent(this.oDefaultDialog);
                }

                this.oDefaultDialog.open();
            } else {
                var oText = this.getView().getModel("i18n").getResourceBundle().getText("noItemSelected");
                MessageToast.show(oText);
            }
        },

        /**
         * Saistīt detalizēto skatu ar mācību moduļa objekta ID
         * @param {Object} sMaterialPath - Atlasītais kurss
         */
        onPress: function(oEvent) {
            this._showObject(oEvent.getSource());
        },


        /**
         * Novirza lietotāju uz mācību moduļa detalizēto skatu
         */
        _showObject: function(oItem) {
            this.getRouter().navTo("learningObject", {
                learningObjectId: oItem.getBindingContext().getPath().substring("/LearningObject".length)
            });
        },
    });
});