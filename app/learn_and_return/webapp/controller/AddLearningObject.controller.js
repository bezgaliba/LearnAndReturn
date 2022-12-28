sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function(BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddLearningObject", {

        onInit: function() {
            this.getRouter().getRoute("addLearningObject").attachPatternMatched(this.studentCheck, this);
        },

        onNavLOList: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("learningObjectList", {}, true);
            this.clearFields()
        },

        createLearningObject: function() {
            var oListBinding = this.getView().getModel().bindList('/LearningObject');
            oListBinding.create({
                Name: this.oObjectNameField.getValue(),
                Type_ID: this.oType_IDField.getSelectedKey(),
                Content: this.oContentField.getValue(),
                Guide: this.oGuideField.getValue(),
                Description: this.oDescriptionField.getValue()
            });
            this.onNavLOList()
        },


        onCreateValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oObjectNameField = this.getView().byId("formLearningObjectName");
            this.oType_IDField = this.getView().byId("formLearningObjectType");
            this.oContentField = this.getView().byId("formLearningObjectContent");
            this.oGuideField = this.getView().byId("formLearningObjectGuide");
            this.oDescriptionField = this.getView().byId("formLearningObjectDescription");
            if ((!this.oContentField.getValue().includes('http') || !this.oContentField.getValue().includes('://')) || this.oContentField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideValidURLLink")
                this.oContentField.setValueState('Warning')
            } else {
                this.oContentField.setValueState()
            }
            if (this.oObjectNameField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLOTitle");
                this.oObjectNameField.setValueState('Warning')
            } else {
                this.oObjectNameField.setValueState()
            }
            if (this.oType_IDField.getSelectedKey().length == 0) {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLOType");
                this.oType_IDField.setValueState('Warning')
            } else {
                this.oType_IDField.setValueState()
            }
            if (this.oGuideField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLOInstructions");
                this.oGuideField.setValueState('Warning')
            } else {
                this.oGuideField.setValueState()
            }
            if (sErrorMsg.length !== 0) {
                MessageBox.error(sErrorMsg)
            } else {
                this.createLearningObject()
            }
        },

        clearFields: function() {
            this.oObjectNameField.setValue("").setValueState()
            this.oType_IDField.clearSelection()
            this.oContentField.setValue("").setValueState()
            this.oGuideField.setValue("").setValueState()
            this.oDescriptionField.setValue("").setValueState()
            this.oType_IDField.setValueState()
        }
    });
});