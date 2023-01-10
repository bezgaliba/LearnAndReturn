//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

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

        /**
         * Nodrošina lietotājam izrakstīties no L&R sistēmas
         */
        onLogoutConfirmation: function() {
            if (!this.oDefaultDialog) {
                // Apstiprinājuma dialoga loga izveide
                this.oDefaultDialog = new Dialog({
                    title: this.getView().getModel("i18n").getResourceBundle().getText("endSession"),
                    content: new Text({
                        text: this.getView().getModel("i18n").getResourceBundle().getText("endSessionDesc")
                    }),
                    type: DialogType.Message,
                    // Noraidījuma pogas izveide
                    beginButton: new Button({
                        type: ButtonType.Emphasized,
                        text: this.getView().getModel("i18n").getResourceBundle().getText("cancelAction"),
                        press: function() {
                            this.oDefaultDialog.close();
                        }.bind(this)
                    }),
                    // Apstiprinājuma pogas izveide
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
            // Izsaukt dialoga logu
            this.oDefaultDialog.open();
        },
    });
});