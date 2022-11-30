sap.ui.define([
    "./BaseController",
    "sap/m/Text",
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/m/library"
], function(BaseController, Text, Dialog, Button, MessageToast, mobileLibrary) {
    "use strict";

    var ButtonType = mobileLibrary.ButtonType;
    var DialogType = mobileLibrary.DialogType;

    return BaseController.extend("learnandreturn.controller.App", {

        onInit: function() {
            this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
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
                            window.location.replace("/logout");
                        }.bind(this)
                    }),
                });

                this.getView().addDependent(this.oDefaultDialog);
            }

            this.oDefaultDialog.open();
        },
    });
});