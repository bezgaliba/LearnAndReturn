sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "../model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/Text",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/library"
], function(BaseController, JSONModel, formatter, Filter, FilterOperator, Text, Dialog, Button, mobileLibrary) {
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

        onLogoutConfirmation: function() {
            if (!this.oDefaultDialog) {
                this.oDefaultDialog = new Dialog({
                    title: this.getView().getModel("i18n").getResourceBundle().getText("endSession"),

                    content: new Text({
                        text: this.getView().getModel("i18n").getResourceBundle().getText("endSessionDesc")
                    }),
                    type: DialogType.Message,
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: this.getView().getModel("i18n").getResourceBundle().getText("cancelAction"),
                        press: function() {
                            this.oDefaultDialog.close();
                        }.bind(this)
                    }),
                    endButton: new Button({
                        type: ButtonType.Emphasized,
                        text: this.getView().getModel("i18n").getResourceBundle().getText("confirmAction"),
                        press: function() {
                            this.oDefaultDialog.close()
                            var oRouter = this.getOwnerComponent().getRouter();
                            oRouter.navTo("Logout", {}, true);
                        }.bind(this)
                    }),
                });
                this.getView().addDependent(this.oDefaultDialog);
            }

            this.oDefaultDialog.open();
        },

        onRefresh: function() {
            var oTable = this.byId("table");
            oTable.getBinding("items").refresh();
        },

        _showObject: function(oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },

        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("courseTable"),
                oViewModel = this.getModel("worklistView"),
                sCourseCat = this.byId('selectedCategory').getSelectedKey();
            if (sCourseCat) {
                oTable.getBinding("items").filter(aTableSearchState, "Application");
            }
            // changes the noDataText of the list in case there are no filter results
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