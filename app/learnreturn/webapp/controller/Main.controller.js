sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/Text",
        "sap/m/Dialog",
        "sap/m/Button",
        "sap/m/library",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator"
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function(Controller, Text, Dialog, Button, mobileLibrary, Filter, FilterOperator) {
        "use strict";

        var ButtonType = mobileLibrary.ButtonType;
        var DialogType = mobileLibrary.DialogType;

        return Controller.extend("learnreturn.controller.Main", {
            onInit: function() {

            },



            onLogoutConfirmation: function() {
                if (!this.oDefaultDialog) {
                    this.oDefaultDialog = new Dialog({
                        title: "End Session Confirmation",
                        content: new Text({
                            text: "Are you sure you want to logout? Any unsaved data will be lost."
                        }),
                        type: DialogType.Message,
                        beginButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Cancel",
                            press: function() {
                                this.oDefaultDialog.close();
                            }.bind(this)
                        }),
                        endButton: new Button({
                            type: ButtonType.Emphasized,
                            text: "Confirm",
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
            onSearch: function(oEvent) {
                // add filter for search
                var aFilters = [];
                var sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    var filter = new Filter("CourseName", FilterOperator.Contains, sQuery);
                    aFilters.push(filter);
                }

                // update list binding
                var oList = this.byId("courseList");
                var oBinding = oList.getBinding("items");
                oBinding.filter(aFilters, "Application");
            },
        });
    });