//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function(BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddLearningObject", {

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: function() {
            // Pārbauda, vai lietotājs ir ar lomu "Student", pieprasot 'AddLearningObject' skatu
            this.getRouter().getRoute("addLearningObject").attachPatternMatched(this.studentCheck, this);
        },

        /**
         * Lietotājs tiek novirzīts uz mācību moduļa sarakstu skatu
         */
        onNavLOList: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("learningObjectList", {}, true);
            this.clearFields()
        },

        /**
         * MAC_101 “Mācību moduļa pievienošana”
         * Funkcija ļauj lietotājam, kuram ir piešķirta loma “Instructor” vai “Admin”, pievienot jaunu mācību moduli.
         * Nodrošina iespēju atlasīt datus no ievadlaukiem un tos pievienot entītijā "LearningObject" ar POST pieprasījumu.
         */

        createLearningObject: function() {
            var oListBinding = this.getView().getModel().bindList('/LearningObject');
            oListBinding.create({
                Name: this.oObjectNameField.getValue(),
                Type_ID: this.oType_IDField.getSelectedKey(),
                Content: this.oContentField.getValue(),
                Guide: this.oGuideField.getValue(),
                Description: this.oDescriptionField.getValue()
            });
            this.onNavLOList()
        },

        /**
         * Pārbauda jauno ievaddatu atbilstību (validācija)
         */
        onCreateValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oObjectNameField = this.getView().byId("formLearningObjectName");
            this.oType_IDField = this.getView().byId("formLearningObjectType");
            this.oContentField = this.getView().byId("formLearningObjectContent");
            this.oGuideField = this.getView().byId("formLearningObjectGuide");
            this.oDescriptionField = this.getView().byId("formLearningObjectDescription");
            /** Norisinās tests T4 */
            if ((!this.oContentField.getValue().includes('http') || !this.oContentField.getValue().includes('://')) || this.oContentField.getValue() == '') {
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
            /** Neveiksmīga testa iziešanas gadījumā, attēlo uzskaitītās kļūmes paziņojumus un neizsauc POST pieprasījumu*/
            if (sErrorMsg.length !== 0) {
                MessageBox.error(sErrorMsg)
            } else {
                this.createLearningObject()
            }
        },

        /**
         * Pēc novirzīšanas uz mācību moduļa saraksta skatu, iztīrīt jaunieviestos datus ievadlaukos
         */
        clearFields: function() {
            this.oObjectNameField.setValue("").setValueState()
            this.oType_IDField.clearSelection()
            this.oContentField.setValue("").setValueState()
            this.oGuideField.setValue("").setValueState()
            this.oDescriptionField.setValue("").setValueState()
            this.oType_IDField.setValueState()
        }
    });
});