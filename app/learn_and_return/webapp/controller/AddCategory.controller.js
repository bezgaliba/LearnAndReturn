sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function(BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddCategory", {

        onInit: function() {
            this.getRouter().getRoute("AddCategory").attachPatternMatched(this.studentCheck, this);
        },

        onNavCategoryList: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("category", {}, true);
        },

        onValidation: function() {

        },

        createCategory: function() {
            var oListBinding = this.getView().getModel().bindList('/CourseCategory');
            oListBinding.create({
                name: this.oCategoryTitleField.getValue(),
                descr: this.oCategoryDescriptionField.getValue(),
            });

            this.onNavCategoryList();
            this.clearFields();
        },

        onCreateValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oCategoryTitleField = this.getView().byId("formCategoryTitle");
            this.oCategoryDescriptionField = this.getView().byId("formCategoryDescription");
            if (this.oCategoryTitleField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCategoryTitle");
                this.oCategoryTitleField.setValueState('Warning')
            } else {
                this.oCategoryTitleField.setValueState()
            }
            if (this.oCategoryDescriptionField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCategoryDesc");
                this.oCategoryDescriptionField.setValueState('Warning')
            } else {
                this.oCategoryDescriptionField.setValueState()
            }
            if (sErrorMsg.length !== 0) {
                MessageBox.error(sErrorMsg)
            } else {
                this.createCategory()
            }
        },

        clearFields: function() {
            this.oCategoryTitleField.setValue("").setValueState();
            this.oCategoryDescriptionField.setValue("").setValueState();
        }
    });
});