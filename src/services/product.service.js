"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "product",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "product.create"
		create: {
			params: {
				title: "string",
				description:"string",
				price:"number"
			},
			handler(ctx) {
				var product = new Models.Product(ctx.params).create();
				console.log("product - create - ", product);
				if (product) {
					return Database()
						.then((db) => {

							var products = db.get("product");

							if(products.find({"title": product.title}).value()){
								return new MoleculerError("product", 409, "ERR_CRITIAL", { code: 409, message: "Product already exist" } )
							}

							return db.get("product")
								.push(product)
								.write()
								.then(() => {
									return product;
								})
								.catch(() => {
									return new MoleculerError("product", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} 
				else {
					return new MoleculerError("product", 417, "ERR_CRITIAL", { code: 417, message: "Product is not valid" } )
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
						return db.get("product").value();
					});
			}
		},


		//	call "user.get" 
		get: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("product.verify", { id_product: ctx.params.id_product })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var product = db.get("product").find({ id_product: ctx.params.id_product }).value();;
								return product;
							})
							.catch(() => {
								return new MoleculerError("product", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} 
					else {
						return new MoleculerError("product", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},

		//	call "user.verify" 
		verify: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("product")
										.filter({ id_product: ctx.params.id_product })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		increment: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("product.verify", { id_product: ctx.params.id_product })
				.then((exists) => {
					if (exists) {
							return ctx.call("product.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();

							product.title = db_product.title;
							product.description = db_product.description;
							product.price = db_product.price;
							product.stock = db_product.stock + 1;
							//

							return Database()
								.then((db) => {
									return db.get("product")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product.id_product;
										})
										.catch(() => {
											return new MoleculerError("Product", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("product", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} 
					else {
						return new MoleculerError("Product", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},

		decrement: {
			params: {
				id_product: "string"
			},
			handler(ctx) {
				return ctx.call("product.verify", { id_product: ctx.params.id_product })
				.then((exists) => {
					if (exists) {
							return ctx.call("product.get", { id_product: ctx.params.id_product })
						.then((db_product) => {
							//
							var product = new Models.Product(db_product).create();

							product.title = db_product.title;
							product.description = db_product.description;
							product.price = db_product.price;
							if(db_product.stock - 1 > 0){
								product.stock = db_product.stock - 1;
							}
							else {
								produit.stock = 0;
							}
							//
							return Database()
								.then((db) => {
									return db.get("product")
										.find({ id_product: ctx.params.id_product })
										.assign(product)
										.write()
										.then(() => {
											return product.id_product;
										})
										.catch(() => {
											return new MoleculerError("Product", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
										});
								})
						})
							.catch(() => {
								return new MoleculerError("Product", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});

					} 
					else {
						return new MoleculerError("Product", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
				})
			}
		},


		//	call "user.edit" --email  --lastName --firstName
		edit: {
			params: {
				id_product: "string",
				title: "string",
				description: "string",
				price: "number",
				stock: "number"
			},
			handler(ctx) {
				return ctx.call("product.verify", { id_product: ctx.params.id_product })
				.then((exists) => {
					if(exists){
						return ctx.call("product.get", { id_product: ctx.params.id_product })
							.then((db_product) => {
								
								var product = new Models.Product(db_product).create();
								product.title = ctx.params.title || db_product.title;
								product.description = ctx.params.description || db_product.description;
								product.price = ctx.params.price || db_product.price;
								product.stock = ctx.params.stock || db_product.stock;
								
								return Database()
									.then((db) => {
										return db.get("product")
											.find({ id_product: ctx.params.id_product })
											.assign(product)
											.write()
											.then(() => {
												return product.id_product;
											})
											.catch(() => {
												return new MoleculerError("product", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
											});
									})
							})
					}
					else {
						return new MoleculerError("Product", 404, "ERR_CRITIAL", { code: 404, message: "Product doesn't exists" } )
					}
					
				})
			}
		}



	}
};
