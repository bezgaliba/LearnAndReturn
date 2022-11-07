sap.ui.define([
    "./BaseController",
], function(BaseController) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddCourse", {
        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRoutePatternMatched(this.onRefresh, this);
        },

        onRefresh: function() {
            var oSelect = this.byId("formCourseCategory"),
                oMultiComboBox = this.byId("formCourseMaterial"),
                oBindingSelect = oSelect.getBinding("items"),
                oBindingMultiComboBox = oMultiComboBox.getBinding("items")
            oBindingSelect.refresh();
            oBindingMultiComboBox.refresh();
        },

        onNavWorklist: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Home", {}, true);
        },

        onCreate: function() {
            let oListBinding = this.getView().getModel().bindList('/Course'),
                oCourseTitleField = this.getView().byId("formCourseTitle"),
                oCourseDescriptionField = this.getView().byId("formCourseDescription"),
                oCourseImageURLField = this.getView().byId("formCourseImageURL"),
                oCourseCategoryField = this.getView().byId("formCourseCategory"),
                oCourseMaterialField = this.getView().byId("formCourseMaterial")
            oListBinding.create({
                CourseName: oCourseTitleField.getValue(),
                Description: oCourseDescriptionField.getValue(),
                ImageURL: oCourseImageURLField.getValue(),
                CourseCategory_ID: oCourseCategoryField.getSelectedKey(),
                CourseMaterial: oCourseMaterialField.getSelectedKeys().map((sKey) => {
                    return { LearningObject_ID: sKey };
                })
            });
            this.onNavWorklist();
            this.clearFields();
        },

        clearFields: function() {
            let oCourseTitleField = this.getView().byId("formCourseTitle"),
                oCourseDescriptionField = this.getView().byId("formCourseDescription"),
                oCourseImageURLField = this.getView().byId("formCourseImageURL"),
                oCourseCategoryField = this.getView().byId("formCourseCategory")
            oCourseTitleField.setValue("");
            oCourseDescriptionField.setValue("");
            oCourseImageURLField.setValue("");
            oCourseCategoryField.removeItem("");
            oCourseMaterialField.clearSelection();
        }
    });
});