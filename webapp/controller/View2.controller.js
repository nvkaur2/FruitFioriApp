sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/routing/History",
	"sap/ui/core/IndicationColor"
], function (Controller, messageBox, messageToast, History, IndicationColor) {
	"use strict";

	return Controller.extend("sap.dev.order.controller.View2", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.dev.order.view.View2
		 */
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.attachRoutePatternMatched(this.turakmakto, this);
			this.getView().byId("btn").addStyleClass("def");
		},
		
		turakmakto: function (oEvent) {
			var fruitId = oEvent.getParameter("arguments").fid;
			var sPath = "/fruits/" + fruitId;
			this.getView().bindElement(sPath);
		},
		onClick: function (oEvent) {
			oEvent.getSource().addStyleClass("abc");
			messageToast.show("Order Cancelled");
		},
		onBack: function () {
			var history = History.getInstance();
			var sPreviousHash = history.getPreviousHash();
			//	this.oRouter.navTo(previousHash);
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			}

		},

		onSelect: function (oEvent) {
			var oo = oEvent.getSource();
			var a = oo.getSelectedItems();
			if (a.length >= 2) {
				oo.setValueState(sap.ui.core.ValueState.Error);
				oo.setValueStateText("Can only select 2 cities");
			} else {
				oo.setValueState(sap.ui.core.ValueState.None);
			}

		},

		oPopSuppliers: null,

		oPopCities: null,

		onSettings: function () {
			//	messageBox.confirm("This page is under construction");
			if (!this.oPopSuppliers) {
				this.oPopSuppliers = new sap.ui.xmlfragment("sap.dev.order.fragments.popup");
				this.getView().addDependent(this.oPopSuppliers);
				this.oPopSuppliers.bindAggregation("items", {
					path: "/Supplier",
					template: new sap.m.DisplayListItem({
						value: "{city}",
						label: "{name}"
					})
				});
			}
			this.oPopSuppliers.open();
		},

		fieldId: "",

		onF4Help: function (oEvent) {
			this.fieldId = oEvent.getSource().getId();
			if (!this.oPopCities) {
				this.oPopCities = new sap.ui.xmlfragment("sap.dev.order.fragments.popup");
				this.getView().addDependent(this.oPopCities);
				this.oPopCities.setMultiSelect(false);
				this.oPopCities.bindAggregation("items", {
					path: "/Cities",
					template: new sap.m.StandardListItem({
						icon: "sap-icon://home",
						title: "{name}",
						description: "{state}"
					})
				});
				this.oPopCities.attachConfirm(this.onConfirm, this);
			}
			this.oPopCities.open();
		},

		onConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var cityName = oSelectedItem.getTitle();
			sap.ui.getCore().byId(this.fieldId).setValue(cityName);
		},

		onSave: function () {
			messageBox.confirm("Do you want to save?", {
				onClose: this.onClose
			});
		},

		onClose: function (args) {
			if (args === "OK") {
				messageToast.show("Your object is saved");
			} else {

				messageBox.error("Object could not be saved");
			}

		}
	});

});