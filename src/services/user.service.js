"use strict";

const Database = require("../adapters/Database");
const Models = require("../models");
const { MoleculerError } = require("moleculer").Errors;

module.exports = {
	name: "user",

	settings: {
 		state: {

 		}
	},

	actions: {

		//	call "user.create" --name "Name"
		create: {
			params: {
				email: "string",
				lastName:"string",
				firstName:"string"
			},
			handler(ctx) {
				var user = new Models.User(ctx.params).create();
				console.log("user - create - ", user);
				if (user) {
					return Database()
						.then((db) => {

							var users = db.get("user");

							if(users.find({"email": user.mail}).value()){
								return new MoleculerError("user", 409, "ERR_CRITIAL", { code: 409, message: "User already exist" } )
							}

							return db.get("user")
								.push(user)
								.write()
								.then(() => {
									return user;
								})
								.catch(() => {
									return new MoleculerError("user", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
								});
					});
				} else {
					return new MoleculerError("user", 417, "ERR_CRITIAL", { code: 417, message: "User is not valid" } )
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
						return db.get("user").value();
					});
			}
		},


		//	call "user.get" 
		get: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return ctx.call("user.verify", { email: ctx.params.email })
				.then((exists) => {
					if (exists) {
						return Database()
							.then((db) => {
								var user = db.get("user").find({ email: ctx.params.email }).value();;
								return user;
							})
							.catch(() => {
								return new MoleculerError("user", 500, "ERR_CRITIAL", { code: 500, message: "Critical error" } )
							});
					} else {
						return new MoleculerError("user", 404, "ERR_CRITIAL", { code: 404, message: "User doesn't exists" } )
					}
				})
			}
		},

		//	call "user.verify" 
		verify: {
			params: {
				email: "string"
			},
			handler(ctx) {
				return Database()
					.then((db) => {
						var value = db.get("user")
										.filter({ email: ctx.params.email })
										.value();
						return value.length > 0 ? true : false;
					})
			}
		},

		//	call "user.edit" --email  --lastName --firstName
		edit: {
			params: {
				email: "string",
				lastName: "string",
				firstName: "string"
			},
			handler(ctx) {
				return ctx.call("user.verify", {email: ctx.params.email })
				.then((exists) => {
					if(exists){
						return ctx.call("user.get", { email: ctx.params.email })
							.then((db_user) => {
								
								var user = new Models.User(db_user).create();
								user.lastName = ctx.params.lastName || db_user.lastName;
								user.firstName = ctx.params.firstName || db_user.firstName;
								
								return Database()
									.then((db) => {
										return db.get("user")
											.find({ email: ctx.params.email })
											.assign(user)
											.write()
											.then(() => {
												return user.email;
											})
											.catch(() => {
												return new MoleculerError("user", 500, "ERR_CRITIAL", { code: 500, message: "Critical Error" } )
											});
									})
							})
					}
					else {
						return new MoleculerError("Utilisateur", 404, "ERR_CRITIAL", { code: 404, message: "User doesn't exists" } )
					}
					
				})
			}
		}



	}
};
