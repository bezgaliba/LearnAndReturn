//Komentāri ir ņemti, ņemot vērā 'Mācību vadības sistēma "Learn&Return"' oficiālo dokumentāciju

sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
], function(BaseController, MessageBox, JSONModel) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.AddCourse", {

        /**
         * Skata ģenerēšanas brīdī...
         */
        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRoutePatternMatched(this.onRefresh, this);
            //Pārbauda, vai lietotājs ir ar lomu "Student", pieprasot 'AddCourse' skatu
            this.getRouter().getRoute("addCourse").attachPatternMatched(this.studentCheck, this);
        },

        /**
         * Atjaunot Select un MultiComboBox izvēlnes katru reizi pieprasot 'AddCourse' skatu
         */
        onRefresh: function() {
            var oSelect = this.byId("formCourseCategory"),
                oMultiComboBox = this.byId("formCourseMaterial"),
                oBindingSelect = oSelect.getBinding("items"),
                oBindingMultiComboBox = oMultiComboBox.getBinding("items")
            oBindingSelect.refresh();
            oBindingMultiComboBox.refresh();
        },

        /**
         * Lietotājs tiek novirzīts uz kursa sarakstu skatu
         */
        onNavWorklist: function() {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("Home", {}, true);
            this.clearFields();
        },

        /**
         * KUR_101 “Kursa pievienošana”
         * Funkcija ļauj lietotājam, kuram ir piešķirta loma “Instructor” vai “Admin”, pievienot jaunu mācību kursu.
         * Nodrošina iespēju atlasīt datus no ievadlaukiem un tos pievienot entītijā "Course" ar POST pieprasījumu.
         */

        createCourse: function() {
            var oListBinding = this.getView().getModel().bindList('/Course');
            oListBinding.create({
                CourseName: this.oCourseTitleField.getValue(),
                Description: this.oCourseDescriptionField.getValue(),
                ShortDescription: this.oCourseShortDescriptionField.getValue(),
                ImageURL: this.oCourseImageURLField.getValue(),
                CourseCategory_ID: this.oCourseCategoryField.getSelectedKey(),
                // Priekš katra atlasītā mācību moduļa, pievieno to kā ierakstu kompozīcijā
                CourseMaterial: this.oCourseMaterialField.getSelectedKeys().map((sKey) => {
                    return { LearningObject_ID: sKey };
                })
            });
            this.onNavWorklist();
        },

        /**
         * Pārbauda jauno ievaddatu atbilstību (validācija)
         */
        onCreateValidation: function() {
            var sErrorMsg = ''
            var oErrorMsgBinding = this.getView().getModel("i18n").getResourceBundle();
            this.oCourseTitleField = this.getView().byId("formCourseTitle");
            this.oCourseDescriptionField = this.getView().byId("formCourseDescription");
            this.oCourseShortDescriptionField = this.getView().byId("formCourseShortDescription");
            this.oCourseImageURLField = this.getView().byId("formCourseImageURL");
            this.oCourseCategoryField = this.getView().byId("formCourseCategory");
            this.oCourseMaterialField = this.getView().byId("formCourseMaterial");
            // Norisinās tests T4
            if ((!this.oCourseImageURLField.getValue().includes('http') || !this.oCourseImageURLField.getValue().includes('://')) && this.oCourseImageURLField.getValue() !== '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideValidURLLink")
                this.oCourseImageURLField.setValueState('Warning')
            } else {
                this.oCourseImageURLField.setValueState()
            }
            // Norisinās tests T2
            if (this.oCourseCategoryField.getSelectedKey().length == 0) {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCategory");
                this.oCourseCategoryField.setValueState('Warning')
            } else {
                this.oCourseCategoryField.setValueState()
            }
            // Norisinās tests T3
            if (this.oCourseMaterialField.getSelectedKeys().length == 0) {
                sErrorMsg += oErrorMsgBinding.getText("addProvideLearningObject");
                this.oCourseMaterialField.setValueState('Warning')
            } else {
                this.oCourseMaterialField.setValueState()
            }
            // Norisinās tests T1 priekš ievadlauka 'Course Title'
            if (this.oCourseTitleField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideCourseTitle");
                this.oCourseTitleField.setValueState('Warning')
            } else {
                this.oCourseTitleField.setValueState()
            }
            // Norisinās tests T1 priekš ievadlauka 'Course Description'
            if (this.oCourseDescriptionField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideDescTitle");
                this.oCourseDescriptionField.setValueState('Warning')
            } else {
                this.oCourseDescriptionField.setValueState()
            }
            // Norisinās tests T1 priekš ievadlauka 'Course Short Description'
            if (this.oCourseShortDescriptionField.getValue() == '') {
                sErrorMsg += oErrorMsgBinding.getText("addProvideShortDescTitle");
                this.oCourseShortDescriptionField.setValueState('Warning')
            } else {
                this.oCourseShortDescriptionField.setValueState()
            }
            // Neveiksmīga testa iziešanas gadījumā, attēlo uzskaitītās kļūmes paziņojumus un neizsauc POST pieprasījumu
            if (sErrorMsg.length !== 0) {
                MessageBox.error(sErrorMsg)
            } else {
                this.createCourse()
            }
        },

        /**
         * Pēc novirzīšanas uz mācību moduļa saraksta skatu, iztīrīt jaunieviestos datus ievadlaukos
         */
        clearFields: function() {
            this.oCourseTitleField.setValue("").setValueState();
            this.oCourseShortDescriptionField.setValue("").setValueState();
            this.oCourseDescriptionField.setValue("").setValueState();
            this.oCourseImageURLField.setValue("").setValueState();
            this.oCourseCategoryField.setValueState()
            this.oCourseCategoryField.removeItem("")
            this.oCourseMaterialField.setValueState()
            this.oCourseMaterialField.clearSelection()
        }
    });
});