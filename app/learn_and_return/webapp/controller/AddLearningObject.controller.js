sap.ui.define([
    "./BaseController",
], function(BaseController) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddLearningObject", {
        onInit: function() {},
        onNavLOList: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("learningObjectList", {}, true);
        },
        onCreate: function() {
            var oListBinding = this.getView().getModel().bindList('/LearningObject');
            this.oObjectNameField = this.getView().byId("formLearningObjectName");
            this.oType_IDField = this.getView().byId("formLearningObjectType");
            this.oContentField = this.getView().byId("formLearningObjectContent");
            this.oGuideField = this.getView().byId("formLearningObjectGuide");
            this.oDescriptionField = this.getView().byId("formLearningObjectDescription");
            oListBinding.create({
                Name: this.oObjectNameField.getValue(),
                Type_ID: this.oType_IDField.getSelectedKey(),
                Content: this.oContentField.getValue(),
                Guide: this.oGuideField.getValue(),
                Description: this.oDescriptionField.getValue()
            });
            var self = this;
            this.onNavLOList();
            this.clearFields();
        },
        clearFields: function() {
            this.oObjectNameField.setValue("");
            this.oType_IDField.setValue("");
            this.oContentField.setValue("");
            this.oGuideField.setValue("");
            this.oDescriptionField.setValue("");
        }
    });
});