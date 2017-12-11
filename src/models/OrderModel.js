const uuidv4 = require('uuid/v4');

var fields_reducers = {
	"id_user": (value) => value.length > 0,
	"quantity": (value) => value >= 0
};


var OrderModel = function(params) {
	this.id_order = params.id_order || uuidv4();
	this.product = params.product || "";
	this.id_user = params.id_user || "";
	this.quantity = params.quantity || 0;
	this.valid = params.valid || false;
}

OrderModel.prototype.create = function() {

	var valid = true;

	var keys = Object.keys(fields_reducers);

	for (var i = 0; i < keys.length; i++)
	{
		if ( typeof this[keys[i]] != typeof undefined ) {
			if ( !fields_reducers[keys[i]](this[keys[i]]) )
			{
				valid = false;
			}
		}
		else
		{
			valid = false;
		}
	}

	if (valid) {
		return this;
	} else {
		return undefined;
	}
}


module.exports = OrderModel;
