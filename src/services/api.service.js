"use strict";

const ApiGateway = require("moleculer-web");


module.exports = {
	name: "api",
	mixins: [ ApiGateway],

	settings: {
		port: process.env.PORT || 9000,

        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin: "*",
            // Configures the Access-Control-Allow-Methods CORS header.
            methods: ["GET", "PATCH", "POST"],
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders: ["Content-Type"],
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders: [],
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials: false,
            // Configures the Access-Control-Max-Age CORS header.
            maxAge: 3600
        },

		routes: [

			{
				bodyParsers: {
	                json: true,
	            },
				path: "/api/v1",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					// The `name` comes from named param.
					// You can access it with `ctx.params.name` in action
					// "GET hi/:name": "greeter.welcome",
					// "POST user/:auth0_id": "user.create",
					"POST user": "user.create",
					"GET user/:email": "user.get",
					"GET user": "user.getAll",
					"PATCH user/:email": "user.edit",
					"POST product": "product.create",
					"GET product/:id_product": "product.get",
					"GET product": "product.getAll",
					"PATCH product/:id_product": "product.edit",
					"PATCH product/:id_product/increment": "product.increment",
					"PATCH product/:id_product/decrement": "product.decrement",
					"POST order/user/:id_user" : "order.create",
					"GET order/:id_order": "order.get",
					"GET order": "order.getAll",
					"GET order/user/:id_user": "order.getUserOrder",
					"PATCH order/:id_order/product/:id_product/increment": "order.increment",
					"PATCH order/:id_order/product/:id_product/decrement": "order.decrement",
					"PATCH order/:id_order": "order.validation"
				}
			},
			{
				bodyParsers: {
	                json: true,
	            },
				path: "/client/",
				whitelist: [
					// Access to any actions in all services
					"*"
				],
				aliases: {
					//	Example project
				}
			}
		]

	}
};
