"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "order",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "user.create" --name "Name"
		create: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
				var order = new Models.Order(ctx.params).create();
				console.log("order - create - ", order);
				if (order) {
					return Database()
						.then((db) => {

							

							return db.get("order")
								.push(order)
								.write()
								.then(() => {
									return order;
								})
								.catch(() => {
									return new MoleculerError("order", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} 
				else {
					return new MoleculerError("order", 417, "ERR_CRITIAL", { code: 417, message: "Order is not valid" } )
				}
			}
		},

		//	call "user.getAll"
		getAll: {
			params: {

			},
			handler(ctx) {
				return Database()
					.then((db) => {
						return db.get("order").value();
					});
			}
		},


		//	call "user.get" 
		get: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return ctx.call("order.verify", { id_order: ctx.params.id_order })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var order = db.get("order").find({ id_order: ctx.params.id_order }).value();;
								return order;
							})
							.catch(() => {
								return new MoleculerError("order", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} 
					else {
						return new MoleculerError("order", 404, "ERR_CRITIAL", { code: 404, message: "Order doesn't exists" } )
					}
				})
			}
		},

		getUserOrder: {
			params: {
				id_user: "string"
			},
			handler(ctx) {
						var tab_id = [];
						var i;

						return Database()
							.then((db) => {
								var order = db.get("order").filter({id_user: ctx.params.id_user}).value();
								for(i = 0; i < order.length; i++){
									tab_id[i] = order[i].id_order;
								}
								return tab_id;
							})
							.catch(() => {
								return new MoleculerError("Order", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
			}
		},

		//	call "user.verify" 
		verify: {
			params: {
				id_order: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("order")
										.filter({ id_order: ctx.params.id_order })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		increment: {
			params: {
				id_order:"string",
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("order.verify", { id_order: ctx.params.id_order })
				.then((exists) => {
					if (exists) {
							return ctx.call("product.verify", {id_product: ctx.params.id_product})
							.then((result) => {
								if(result) {
									return ctx.call("order.get", { id_order: ctx.params.id_order })
						.then((db_order) => {
							//
							var order = new Models.Order(db_order).create();

							order.product = ctx.params.id_product;
							order.id_user = db_order.id_user;
							order.quantity = db_order.quantity + 1;
							order.valid = db_order.valid;
							

							return Database()
								.then((db) => {
									return db.get("order")
										.find({ id_order: ctx.params.id_order })
										.assign(order)
										.write()
										.then(() => {
											return order;
										})
										.catch(() => {
											return new MoleculerError("Order", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Order", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});

								}
								else{
									return new MoleculerError("Product", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
								}
							}

								)
							
					} 
					else {
						return new MoleculerError("Order", 404, "ERR_CRITIAL", { code: 404, message: "Order doesn't exists" } )
					}
				})
			}
		},


		decrement: {
			params: {
				id_order:"string",
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("order.verify", { id_order: ctx.params.id_order })
				.then((exists) => {
					if (exists) {
							return ctx.call("product.verify", {id_product: ctx.params.id_product})
							.then((result) => {
								if(result) {
									return ctx.call("order.get", { id_order: ctx.params.id_order })
						.then((db_order) => {
							//
							var order = new Models.Order(db_order).create();

							order.product = ctx.params.id_product;
							order.id_user = db_order.id_user;
							if(db_order.quantity - 1 > 0){
								order.quantity = db_order.quantity - 1;
							}
							else {
								order.quantity = 0;
							}
							order.valid = db_order.valid;
							//


							return Database()
								.then((db) => {
									return db.get("order")
										.find({ id_order: ctx.params.id_order })
										.assign(order)
										.write()
										.then(() => {
											return order;
										})
										.catch(() => {
											return new MoleculerError("Order", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Order", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});

								}
								else{
									return new MoleculerError("product", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
								}
							}

								)
							
					} 
					else {
						return new MoleculerError("Order", 404, "ERR_CRITIAL", { code: 404, message: "Order doesn't exists" } )
					}
				})
			}
		},	


		validation: {
			params: {
				id_order:"string",
			},
			handler(ctx) {
				return ctx.call("order.verify", { id_order: ctx.params.id_order })
				.then((exists) => {
					if (exists) {
							return ctx.call("order.get", { id_order: ctx.params.id_order })
						.then((db_order) => {
							//
							var order = new Models.Order(db_order).create();
							order.product = db_order.product;
							order.id_user = db_order.id_user;
							order.quantity = db_order.quantity;
							if (!db_order.valid) {
								order.valid = !db_order.valid;
							}
							else {
								order.valid = db_order.valid;
							}
														//
							return Database()
								.then((db) => {
									return db.get("order")
										.find({ id_order: ctx.params.id_order })
										.assign(order)
										.write()
										.then(() => {
											return order;
										})
										.catch(() => {
											return new MoleculerError("Order", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("order", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("order", 404, "ERR_CRITIAL", { code: 404, message: "Order doesn't exists" } )
					}
				})
			}
		}



	}
};
