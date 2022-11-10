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


        onPost: function() {
            z
            var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
            var sDate = oFormat.format(new Date());
            var oObject = this.getView().getBindingContext().getObject();
            var sValue = oEvent.getParameter("value");
            var oEntry = {
                ReviewID: oObject.ReviewID,
                type: "Comment",
                date: sDate,
                comment: sValue
            };
            var oModel = this.getModel("review");
            var aEntries = oModel.getData().review;
            aEntries.push(oEntry);
            oModel.setData({
                review: aEntries
            });
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