sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function(BaseController, JSONModel, History) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.EditCourseObject", {
        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("editCourseObject").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "editCourseObjectView");
        },

        _onObjectMatched: function(oEvent) {
            var sEditableCourseId = oEvent.getParameter("arguments").editCourseObjectId;
            var sTempEditableCourseId = sEditableCourseId.replace('(', '');
            this.sModifiedEditableCourseId = sTempEditableCourseId.replace(')', '');
            this._bindView("/Course" + sEditableCourseId);
        },

        _bindView: function(sEditableCourseObjectPath) {
            var oViewModel = this.getModel("editCourseObjectView");
            this.getView().bindElement({
                path: sEditableCourseObjectPath,
                events: {
                    change: this._onBindingChange.bind(this),
                    dataRequested: function() {
                        oViewModel.setProperty("/busy", true);
                    },
                    dataReceived: function() {
                        oViewModel.setProperty("/busy", false);
                    }
                }
            });
        },

        _onBindingChange: function() {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }
        },

        onNavBack: function() {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("Home", {}, true);
            }
        },

        onSave: function() {
            let oListBinding = this.getView().getModel().bindList('/Course'),
                oCourseCategoryField = this.getView().byId("formCourseCategory"),
                oCourseMaterialField = this.getView().byId("formCourseMaterial")
            oListBinding.create({
                ID: this.sModifiedEditableCourseId,
                CourseCategory_ID: oCourseCategoryField.getSelectedKey(),
                CourseMaterial: oCourseMaterialField.getSelectedKeys().map((sKey) => {
                    return { LearningObject_ID: sKey };
                })
            });
            this.onNavBack();
            this.clearFields();
        },

        // clearFields: function() {
        //     let oCategoryTitleField = this.getView().byId("formCategoryTitle"),
        //         oCategoryDescriptionField = this.getView().byId("formCategoryDescription")
        //     oCategoryTitleField.setValue("");
        //     oCategoryDescriptionField.setValue("");
        // }
    });
});