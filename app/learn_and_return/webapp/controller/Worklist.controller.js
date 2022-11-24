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

        onInit: function() {
            var oViewModel;
            this._aTableSearchState = [];
            oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
            });
            this.setModel(oViewModel, "worklistView");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRoutePatternMatched(this.onRefresh, this);
        },

        onRefresh: function() {
            var oList = this.byId("courseTable"),
                oBindingList = oList.getBinding("items")
            oBindingList.refresh();
        },

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

        onPress: function(oEvent) {
            this._showObject(oEvent.getSource());
        },

        onNavHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Home", {});
        },

        onNavLO: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("learningObjectList", {});
        },

        onNavCreate: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("addCourse", {});
        },

        onNavCat: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("category", {});
        },

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

        _showObject: function(oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },

        _applySearch: function(aTableSearchState) {
            var oViewModel = this.getModel("worklistView")
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("noSearchData"));
            }
        },

        onLiveChange: function() {
            let sCourseCat = this.byId('selectedCategory').getSelectedKey(),
                oTable = this.byId("courseTable"),
                oFilter = sCourseCat ? new Filter('CourseCategory/ID', FilterOperator.EQ, sCourseCat) : null;
            oTable.getBinding("items").filter(oFilter);
        }
    });
});