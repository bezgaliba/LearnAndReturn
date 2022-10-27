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

        /* =========================================================== */
        /* lifecycle methods                                           */
        /* =========================================================== */

        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function() {
            var oViewModel;

            // keeps the search state
            this._aTableSearchState = [];

            // Model used to manipulate control states
            oViewModel = new JSONModel({
                worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
                tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
            });
            this.setModel(oViewModel, "worklistView");

        },

        /* =========================================================== */
        /* event handlers                                              */
        /* =========================================================== */

        /**
         * Triggered by the table's 'updateFinished' event: after new table
         * data is available, this handler method updates the table counter.
         * This should only happen if the update was successful, which is
         * why this handler is attached to 'updateFinished' and not to the
         * table's list binding's 'dataReceived' method.
         * @param {sap.ui.base.Event} oEvent the update finished event
         * @public
         */
        onUpdateFinished: function(oEvent) {
            // update the worklist's object counter after the table update
            var sTitle,
                oTable = oEvent.getSource(),
                iTotalItems = oEvent.getParameter("total");
            // only update the counter if the length is final and
            // the table is not empty
            if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
                sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
            } else {
                sTitle = this.getResourceBundle().getText("worklistTableTitle");
            }
            this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
        },

        /**
         * Event handler when a table item gets pressed
         * @param {sap.ui.base.Event} oEvent the table selectionChange event
         * @public
         */
        onPress: function(oEvent) {
            // The source is the list item that got pressed
            this._showObject(oEvent.getSource());
        },

        /**
         * Event handler for navigating back.
         * Navigate back in the browser history
         * @public
         */
        onNavHome: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Home", {});
        },

        onNavLO: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("learningObjectList", {});
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

        /* =========================================================== */
        /* internal methods                                            */
        /* =========================================================== */

        /**
         * Shows the selected item on the object page
         * @param {sap.m.ObjectListItem} oItem selected Item
         * @private
         */
        _showObject: function(oItem) {
            this.getRouter().navTo("object", {
                objectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },

        /**
         * Internal helper method to apply both filter and search state together on the list binding
         * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
         * @private
         */
        _applySearch: function(aTableSearchState) {
            var oTable = this.byId("table"),
                oViewModel = this.getModel("worklistView");
            oTable.getBinding("items").filter(aTableSearchState, "Application");
            // changes the noDataText of the list in case there are no filter results
            if (aTableSearchState.length !== 0) {
                oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("noSearchData"));
            }
        }

    });
});