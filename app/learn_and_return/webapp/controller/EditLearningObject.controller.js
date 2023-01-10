//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
], function(BaseController, JSONModel, History, MessageBox) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.EditLearningObject", {

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });

            this.getRouter().getRoute("editLearningObject").attachPatternMatched(this._onObjectMatched, this);
            //Pārbauda, vai lietotājs ir ar lomu "Student", pieprasot 'EditCourseObject' skatu
            this.getRouter().getRoute("editLearningObject").attachPatternMatched(this.studentCheck, this);
            this.setModel(oViewModel, "editLearningObjectView");
        },

        /**
         * Saistīt skatu ar mācību modeļa objekta ID, kas ir definēts manifest.json
         * @param {Object} oEvent - Mācību moduļa objekts
         */
        _onObjectMatched: function(oEvent) {
            var sEditableLearningObjectId = oEvent.getParameter("arguments").editLearningObjectId;
            this._bindView("/LearningObject" + sEditableLearningObjectId);
        },

        /**
         * Saistīt skatu ar objekta ID
         * @param {String} sEditableLearningObjectPath - Servisa līmeņa entītija ar padoto kursa objekta ID
         */
        _bindView: function(sEditableLearningObjectPath) {
            var oViewModel = this.getModel("editLearningObjectView");
            this.getView().bindElement({
                path: sEditableLearningObjectPath,
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

        /**
         * Pārbauda, vai padotais URL pattern ir valid (vai eksistē objekts)
         */
        _onBindingChange: function() {
            var oView = this.getView(),
                oElementBinding = oView.getElementBinding();
            if (!oElementBinding.getBoundContext()) {
                this.getRouter().getTargets().display("objectNotFound");
                return;
            }
        },

        /**
         * Pārbauda jauno ievaddatu atbilstību (validācija)
         */
        onSaveValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oObjectNameField = this.getView().byId("formLearningObjectName");
            this.oType_IDField = this.getView().byId("formLearningObjectType");
            this.oContentField = this.getView().byId("formLearningObjectContent");
            this.oGuideField = this.getView().byId("formLearningObjectGuide");
            this.oDescriptionField = this.getView().byId("formLearningObjectDescription");
            // Norisinās tests T4
            if ((!this.oContentField.getValue().includes('http') || !this.oContentField.getValue().includes('://')) && this.oContentField.getValue() !== '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideValidURLLink")
                this.oContentField.setValueState('Warning')
            } else {
                this.oContentField.setValueState()
            }
            /**Norisinās tests T1 priekš ievadlauka 'Title' */
            if (this.oObjectNameField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLOTitle");
                this.oObjectNameField.setValueState('Warning')
            } else {
                this.oObjectNameField.setValueState()
            }
            /** Norisinās tests T2 */
            if (this.oType_IDField.getSelectedKey().length == 0) {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLOType");
                this.oType_IDField.setValueState('Warning')
            } else {
                this.oType_IDField.setValueState()
            }
            /**Norisinās tests T1 priekš ievadlauka 'Instructions' */
            if (this.oGuideField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLOInstructions");
                this.oGuideField.setValueState('Warning')
            } else {
                this.oGuideField.setValueState()
            }
            if (sErrorMsg.length !== 0) {
                MessageBox.error(sErrorMsg)
            } else {
                this.onNavBack()
            }
        },

        /**
         * Lietotājs tiek novirzīts uz mācību moduļa detalizēto skatu. Ja izsauca skatu caur URL un
         * uzspieš pogu "Go Back", tad uz mācību moduļa sarakstu.
         */
        onNavBack: function() {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("learningObjectList", {}, true);
            }
        },
    });
});