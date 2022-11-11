sap.ui.define([
    "./BaseController",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History",
    "../model/formatter",
    "sap/ui/core/format/DateFormat",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(BaseController, JSONModel, History, formatter, DateFormat, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.Object", {

        formatter: formatter,
        onInit: function() {
            var oViewModel = new JSONModel({
                busy: true,
                delay: 0
            });
            this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
            this.setModel(oViewModel, "objectView");
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

        _onObjectMatched: function(oEvent) {
            var sObjectId = oEvent.getParameter("arguments").objectId;
            var sTempObjectId = sObjectId.replace('(', '');
            this.sModifiedObjectId = sTempObjectId.replace(')', '');
            this._bindView("/Course" + sObjectId);
        },

        _bindView: function(sObjectPath) {
            var oViewModel = this.getModel("objectView");

            this.getView().bindElement({
                path: sObjectPath,
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
            // var oList = this.byId("reviewList");
            // var oBinding = oList.getBinding("items");
            // oBinding.filter(new Filter("ReviewID", FilterOperator.EQ, sObjectId));
        },


        onPost: function(oEvent) {
            var oListBinding = this.byId("reviewList").getBinding("items"),
                oRatingField = this.getView().byId("reviewStarSelection")
            oListBinding.create({
                up__ID: this.sModifiedObjectId,
                Comment: oEvent.getParameter("value"),
                Rating: oRatingField.getSelectedKey(),
            }, false);
        },

        onRefresh: function() {
            var oCommentsList = this.byId("reviewList"),
                oBindingCommentsList = oCommentsList.getBinding("items")
            oBindingCommentsList.requestRefresh();
        },

        onEdit: function(oEvent) {
            this._showEditableObject(oEvent.getSource())
        },

        onEnroll: function(oEvent) {
            this._showObject(oEvent.getSource());
        },

        _showEditableObject: function(oItem) {
            this.getRouter().navTo("editCourseObject", {
                editCourseObjectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },

        _showObject: function(oItem) {
            this.getRouter().navTo("material", {
                materialObjectId: oItem.getBindingContext().getPath().substring("/Course".length)
            });
        },

    });

});