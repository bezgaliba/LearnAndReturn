sap.ui.define([
    "./BaseController"
], function(BaseController) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddCategory", {

        onInit: function() {},
        onNavCategoryList: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("category", {}, true);
        },

        onCreate: function() {
            let oListBinding = this.getView().getModel().bindList('/CourseCategory'),
                oCategoryTitleField = this.getView().byId("formCategoryTitle"),
                oCategoryDescriptionField = this.getView().byId("formCategoryDescription")
            oListBinding.create({
                name: oCategoryTitleField.getValue(),
                descr: oCategoryDescriptionField.getValue(),
            });
            this.onNavCategoryList();
            this.clearFields();
        },

        clearFields: function() {
            let oCategoryTitleField = this.getView().byId("formCategoryTitle"),
                oCategoryDescriptionField = this.getView().byId("formCategoryDescription")
            oCategoryTitleField.setValue("");
            oCategoryDescriptionField.setValue("");
        }
    });
});