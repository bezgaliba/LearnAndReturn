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
            let oListBinding = this.getView().getModel().bindList('/LearningObject'),
                oObjectNameField = this.getView().byId("formLearningObjectName"),
                oType_IDField = this.getView().byId("formLearningObjectType"),
                oContentField = this.getView().byId("formLearningObjectContent"),
                oDescriptionField = this.getView().byId("formLearningObjectDescription");
            oListBinding.create({
                Name: oObjectNameField.getValue(),
                Type_ID: oType_IDField.getSelectedKey(),
                Content: oContentField.getValue(),
                Description: oDescriptionField.getValue()
            });
            var self = this;
            this.onNavLOList();
            this.clearFields();
        },
        clearFields: function() {
            let oObjectNameField = this.getView().byId("formLearningObjectName"),
                oType_IDField = this.getView().byId("formLearningObjectType"),
                oContentField = this.getView().byId("formLearningObjectContent"),
                oDescriptionField = this.getView().byId("formLearningObjectDescription");
            oObjectNameField.setValue("");
            oType_IDField.setValue("");
            oContentField.setValue("");
            oDescriptionField.setValue("");
        }
    });
});