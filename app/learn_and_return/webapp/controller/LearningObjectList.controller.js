sap.ui.define([
    "./BaseController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(BaseController, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("learnandreturn.controller.LearningObjectList", {
        onInit: function() {},
        onSearch: function(oEvent) {
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("Name", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
            var oList = this.byId("learningObjectList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters, "Application");
        },
    });
});