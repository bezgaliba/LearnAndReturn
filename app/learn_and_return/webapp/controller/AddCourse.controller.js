sap.ui.define([
    "./BaseController",
    "sap/m/MessageToast"
], function(BaseController) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddCourse", {

        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRoutePatternMatched(this.onRefresh, this);
            this.getRouter().getRoute("addCourse").attachPatternMatched(this.studentCheck, this);
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
            this.clearFields();
        },

        onCreate: function() {
            var oListBinding = this.getView().getModel().bindList('/Course');
            this.oCourseTitleField = this.getView().byId("formCourseTitle");
            this.oCourseDescriptionField = this.getView().byId("formCourseDescription");
            this.oCourseShortDescriptionField = this.getView().byId("formCourseShortDescription");
            this.oCourseImageURLField = this.getView().byId("formCourseImageURL");
            this.oCourseCategoryField = this.getView().byId("formCourseCategory");
            this.oCourseMaterialField = this.getView().byId("formCourseMaterial");
            if (this.oCourseImageURLField.getValue().includes('http') && !this.oCourseImageURLField.getValue().includes('://')) {
                oListBinding.create({
                    CourseName: this.oCourseTitleField.getValue(),
                    Description: this.oCourseDescriptionField.getValue(),
                    ShortDescription: this.oCourseDescriptionField.getValue(),
                    ImageURL: this.oCourseImageURLField.getValue(),
                    CourseCategory_ID: this.oCourseCategoryField.getSelectedKey(),
                    CourseMaterial: this.oCourseMaterialField.getSelectedKeys().map((sKey) => {
                        return { LearningObject_ID: sKey };
                    })
                });
                this.onNavWorklist();
            } else {
                MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("addProvideValidURLLink"));
            }
        },

        clearFields: function() {
            this.oCourseTitleField.setValue("");
            this.oCourseShortDescriptionField.setValue("");
            this.oCourseDescriptionField.setValue("");
            this.oCourseImageURLField.setValue("");
            this.oCourseCategoryField.removeItem("");
            this.oCourseMaterialField.clearSelection();
        }
    });
});