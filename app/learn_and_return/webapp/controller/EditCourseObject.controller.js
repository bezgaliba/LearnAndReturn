sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function(BaseController, JSONModel, History, MessageBox) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.EditCourseObject", {

        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.getRouter().getRoute("editCourseObject").attachPatternMatched(this._onObjectMatched, this);
            this.getRouter().getRoute("editCourseObject").attachPatternMatched(this.studentCheck, this);
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

        onSaveValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oCourseTitleField = this.getView().byId("formCourseTitle");
            this.oCourseDescriptionField = this.getView().byId("formCourseDescription");
            this.oCourseShortDescriptionField = this.getView().byId("formCourseShortDescription");
            this.oCourseImageURLField = this.getView().byId("formCourseImageURL");
            if (!this.oCourseImageURLField.getValue().includes('http') || !this.oCourseImageURLField.getValue().includes('://') && this.oCourseImageURLField.getValue() !== '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideValidURLLink")
                this.oCourseImageURLField.setValueState('Warning')
            } else {
                this.oCourseImageURLField.setValueState()
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
                this.onNavBack()
            }
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
            this.oCourseTitleField.setValueState();
            this.oCourseShortDescriptionField.setValueState();
            this.oCourseDescriptionField.setValueState();
            this.oCourseImageURLField.setValueState();
        },
    });
});