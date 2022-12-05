sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function(BaseController, MessageBox) {
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

        createCourse: function() {
            var oListBinding = this.getView().getModel().bindList('/Course');
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
        },

        onCreateValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oCourseTitleField = this.getView().byId("formCourseTitle");
            this.oCourseDescriptionField = this.getView().byId("formCourseDescription");
            this.oCourseShortDescriptionField = this.getView().byId("formCourseShortDescription");
            this.oCourseImageURLField = this.getView().byId("formCourseImageURL");
            this.oCourseCategoryField = this.getView().byId("formCourseCategory");
            this.oCourseMaterialField = this.getView().byId("formCourseMaterial");
            if ((!this.oCourseImageURLField.getValue().includes('http') || !this.oCourseImageURLField.getValue().includes('://')) && this.oCourseImageURLField.getValue() !== '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideValidURLLink")
                this.oCourseImageURLField.setValueState('Warning')
            } else {
                this.oCourseImageURLField.setValueState()
            }
            if (this.oCourseCategoryField.getSelectedKey().length == 0) {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCategory");
                this.oCourseCategoryField.setValueState('Warning')
            } else {
                this.oCourseCategoryField.setValueState()
            }
            if (this.oCourseMaterialField.getSelectedKeys().length == 0) {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLearningObject");
                this.oCourseMaterialField.setValueState('Warning')
            } else {
                this.oCourseMaterialField.setValueState()
            }
            if (this.oCourseTitleField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCourseTitle");
                this.oCourseTitleField.setValueState('Warning')
            } else {
                this.oCourseTitleField.setValueState()
            }
            if (this.oCourseDescriptionField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideDescTitle");
                this.oCourseDescriptionField.setValueState('Warning')
            } else {
                this.oCourseDescriptionField.setValueState()
            }
            if (this.oCourseShortDescriptionField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideShortDescTitle");
                this.oCourseShortDescriptionField.setValueState('Warning')
            } else {
                this.oCourseShortDescriptionField.setValueState()
            }
            if (sErrorMsg.length !== 0) {
                MessageBox.error(sErrorMsg)
            } else {
                this.createCourse()
            }
        },

        clearFields: function() {
            this.oCourseTitleField.setValue("").setValueState();
            this.oCourseShortDescriptionField.setValue("").setValueState();
            this.oCourseDescriptionField.setValue("").setValueState();
            this.oCourseImageURLField.setValue("").setValueState();
            this.oCourseCategoryField.setValueState()
            this.oCourseCategoryField.removeItem("");
            this.oCourseMaterialField.setValueState()
            this.oCourseMaterialField.clearSelection();
        }
    });
});