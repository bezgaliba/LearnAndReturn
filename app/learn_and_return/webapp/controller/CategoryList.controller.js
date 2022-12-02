sap.ui.define([
    "./BaseController",
    "sap/m/library",
    "sap/m/Text",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
], function(BaseController, mobileLibrary, Text, Dialog, Button, MessageToast, Filter, FilterOperator) {
    "use strict";

    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;

    return BaseController.extend("learnandreturn.controller.CategoryList", {

        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRoutePatternMatched(this.onRefresh, this);
            this.getRouter().getRoute("category").attachPatternMatched(this.studentCheck, this);
        },

        onRefresh: function() {
            var oList = this.byId("categoryList"),
                oBindingList = oList.getBinding("items")
            oBindingList.refresh();
        },

        onSearch: function(oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("name", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
            var oList = this.byId("categoryList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },

        onNavHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Home", {});
        },

        onNavCreate: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("AddCategory", {});
        },

        deleteCategory: function() {
            var oSelected = this.byId("categoryList").getSelectedItem();
            if (oSelected) {
                oSelected.getBindingContext().delete("$auto").then(function() {
                    MessageToast.show(this._getText("deletemsg"));
                }.bind(this), function(oError) {
                    MessageBox.error(oError.message);
                });
            }
        },

        onDeleteConfirmation: function() {
            var oSelected = this.byId("categoryList").getSelectedItem();
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
                                this.byId("categoryList").removeSelections(true);
                                this.oDefaultDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            type: ButtonType.Emphasized,
                            text: this.getView().getModel("i18n").getResourceBundle().getText("confirmAction"),
                            press: function() {
                                this.oDefaultDialog.close()
                                var self = this;
                                self.deleteCategory();
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
    });
});