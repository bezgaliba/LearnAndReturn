sap.ui.define([
    "./BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddLearningObject", {
        onInit: function() {},
        onNavLOList: function() {
            debugger;
        },
        onCreate: function() {
            let oListBinding = this.getView().getModel().bindList('/LearningObject');
            oListBinding.attachCreateCompleted((response) => {
                debugger
            });
            oListBinding.create({
                Name: this.getView().byId("formLearningObjectName").getValue(),
                Type_ID: this.getView().byId("formLearningObjectType").getSelectedKey(),
                Content: this.getView().byId("formLearningObjectContent").getValue(),
                Description: this.getView().byId("formLearningObjectDescription").getValue()
            });
        },
        // debugger: function() {
        //     debugger;
        // },
    });
});