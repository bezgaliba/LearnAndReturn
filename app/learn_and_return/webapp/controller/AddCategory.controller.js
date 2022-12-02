sap.ui.define([
    "./BaseController"
], function(BaseController) {
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

        onCreate: function() {
            var oListBinding = this.getView().getModel().bindList('/CourseCategory');
            this.oCategoryTitleField = this.getView().byId("formCategoryTitle");
            this.oCategoryDescriptionField = this.getView().byId("formCategoryDescription");
            oListBinding.create({
                name: this.oCategoryTitleField.getValue(),
                descr: this.oCategoryDescriptionField.getValue(),
            });

            this.onNavCategoryList();
            this.clearFields();
        },

        clearFields: function() {
            this.oCategoryTitleField.setValue("");
            this.oCategoryDescriptionField.setValue("");
        }
    });
});