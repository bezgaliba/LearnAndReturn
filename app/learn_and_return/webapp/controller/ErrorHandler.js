sap.ui.define([
    "sap/ui/base/Object",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(UI5Object, MessageBox, Filter, FilterOperator) {
    "use strict";

    return UI5Object.extend("learnandreturn.controller.ErrorHandler", {

        constructor: function(oComponent) {
            var oMessageManager = sap.ui.getCore().getMessageManager(),
                oMessageModel = oMessageManager.getMessageModel(),
                oResourceBundle = oComponent.getModel("i18n").getResourceBundle(),
                sErrorText = oResourceBundle.getText("objectPatternError"),
                sMultipleErrors = oResourceBundle.getText("fatalError");

            this._oComponent = oComponent;
            this._bMessageOpen = false;

            this.oMessageModelBinding = oMessageModel.bindList("/", undefined, [], new Filter("technical", FilterOperator.EQ, true));

            this.oMessageModelBinding.attachChange(function(oEvent) {
                var aContexts = oEvent.getSource().getContexts(),
                    aMessages = [],
                    sErrorTitle;

                if (this._bMessageOpen || !aContexts.length) {
                    return;
                }

                aContexts.forEach(function(oContext) {
                    aMessages.push(oContext.getObject());
                });

                oMessageManager.removeMessages(aMessages);
                sErrorTitle = aMessages.length === 1 ? sErrorText : sMultipleErrors;
                this._showServiceError(sErrorTitle, aMessages[0].message);
            }, this);
        },

        _showServiceError: function(sErrorTitle, sDetails) {
            this._bMessageOpen = true;
            MessageBox.error(
                sErrorTitle, {
                    id: "serviceErrorMessageBox",
                    details: sDetails,
                    styleClass: this._oComponent.getContentDensityClass(),
                    actions: [MessageBox.Action.CLOSE],
                    onClose: function() {
                        this._bMessageOpen = false;
                    }.bind(this)
                }
            );
        }
    });
});