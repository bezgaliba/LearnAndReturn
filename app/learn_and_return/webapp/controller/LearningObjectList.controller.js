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
        onInit: function() {},
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
        onNavHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Home", {});
        },
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
        // onSelect: function(oEvent) {
        //     var oList = this.byId("learningObjectList");
        //     var oSelected = oList.getSelectedItem();
        //     if (oSelected) {
        //             oList.removeSelections(true);
        //     }
        // },
        onPress: function(oEvent) {
            console.log("hi");
            this._showObject(oEvent.getSource());
        },
        _showObject: function(oItem) {
            console.log("hieyey");
            this.getRouter().navTo("learningObject", {
                learningObjectId: oItem.getBindingContext().getPath().substring("/LearningObject".length)
            });
        },

    });
});