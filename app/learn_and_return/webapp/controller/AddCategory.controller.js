//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox"
], function(BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddCategory", {

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: function() {
            // Pārbauda, vai lietotājs ir ar lomu "Student", pieprasot 'AddCategory' skatu
            this.getRouter().getRoute("AddCategory").attachPatternMatched(this.studentCheck, this);
        },

        /**
         * Lietotājs tiek novirzīts uz kategoriju sarakstu skatu
         */
        onNavCategoryList: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("category", {}, true);
        },

        /**
         * KAT_101 “Kategorijas pievienošana”
         * Ļauj sistēmas lietotājiem ar lomu “Instructor” vai “Admin” sistēmā pievienot kursa kategoriju.
         * Nodrošina iespēju atlasīt datus no ievadlaukiem un tos pievienot entītijā "CourseCategory" ar POST pieprasījumu.
         */

        createCategory: function() {
            var oListBinding = this.getView().getModel().bindList('/CourseCategory');
            oListBinding.create({
                name: this.oCategoryTitleField.getValue(),
                descr: this.oCategoryDescriptionField.getValue(),
            });

            this.onNavCategoryList();
            this.clearFields();
        },

        /**
         * Pārbauda jauno ievaddatu atbilstību (validācija)
         */
        onCreateValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oCategoryTitleField = this.getView().byId("formCategoryTitle");
            this.oCategoryDescriptionField = this.getView().byId("formCategoryDescription");
            // Norisinās tests T1 priekš ievadlauka "Category Name"
            if (this.oCategoryTitleField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCategoryTitle");
                this.oCategoryTitleField.setValueState('Warning')
            } else {
                this.oCategoryTitleField.setValueState()
            }
            // Norisinās tests T1 priekš ievadlauka "Description"
            if (this.oCategoryDescriptionField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCategoryDesc");
                this.oCategoryDescriptionField.setValueState('Warning')
            } else {
                this.oCategoryDescriptionField.setValueState()
            }
            // Neveiksmīga testa iziešanas gadījumā, attēlo uzskaitītās kļūmes paziņojumus un neizsauc POST pieprasījumu
            if (sErrorMsg.length !== 0) {
                MessageBox.error(sErrorMsg)
            } else {
                this.createCategory()
            }
        },

        /**
         * Pēc novirzīšanas uz mācību moduļa saraksta skatu, iztīrīt jaunieviestos datus ievadlaukos
         */
        clearFields: function() {
            this.oCategoryTitleField.setValue("").setValueState();
            this.oCategoryDescriptionField.setValue("").setValueState();
        }
    });
});