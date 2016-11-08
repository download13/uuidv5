var crypto = require('crypto');


var NAMESPACE_DNS = uuidFromString('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
var NAMESPACE_URL = uuidFromString('6ba7b811-9dad-11d1-80b4-00c04fd430c8');
var NAMESPACE_OID = uuidFromString('6ba7b812-9dad-11d1-80b4-00c04fd430c8');
var NAMESPACE_X500 = uuidFromString('6ba7b814-9dad-11d1-80b4-00c04fd430c8');
var NAMESPACE_NULL = uuidFromString('00000000-0000-0000-0000-000000000000');


function createUUIDv5Binary(namespace, name) {
	var c = Buffer.concat([namespace, name], namespace.length + name.length);

	var digest = crypto.createHash('sha1').update(c).digest();
	var uuid = new Buffer(16);

	// bbbb - bb - bb - bb - bbbbbb
	digest.copy(uuid, 0, 0, 4); // time_low
	digest.copy(uuid, 4, 4, 6); // time_mid
	digest.copy(uuid, 6, 6, 8); // time_hi_and_version
	uuid[6] = (uuid[6] & 0x0f) | 0x50; // version, 4 most significant bits are set to version 5 (0101)
	uuid[8] = (digest[8] & 0x3f) | 0x80; // clock_seq_hi_and_reserved, 2msb are set to 10
	uuid[9] = digest[9];
	digest.copy(uuid, 10, 10, 16);

	return uuid;
}

function uuidToString(uuid) {
	if(!Buffer.isBuffer(uuid)) {
		throw new Error('uuid must be a Buffer');
	}

	if(uuid.length !== 16) {
		throw new Error('uuid buffer length must be 16');
	}

	var raw = '';

	for(var i = 0; i < 16; i++) {
		var n = uuid[i].toString(16);
		if(n.length < 2) n = '0' + n;
		raw += n;
	}

	var r = raw.substr(0, 8)
		+ '-' + raw.substr(8, 4)
		+ '-' + raw.substr(12, 4)
		+ '-' + raw.substr(16, 4)
		+ '-' + raw.substr(20);

	return r.toLowerCase();
}

function uuidFromString(uuid) {
	if(typeof uuid !== 'string') {
		throw new Error('uuid must be a string');
	}

	var raw = uuid.replace(/-/g, '');
	if(raw.length !== 32) {
		throw new Error('uuid string length must be 32 with -\'s removed');
	}

	var octets = [];

	for(var i = 0; i < 16; i++) {
		octets[i] = parseInt(raw.substr(i * 2, 2), 16);
	}

	return new Buffer(octets);
}

function getNamespace(namespace) {
	if(!Buffer.isBuffer(namespace)) {
		switch(namespace.toLowerCase()) { // Default namespaces
		case 'dns':
			return NAMESPACE_DNS;

		case 'url':
			return NAMESPACE_URL;

		case 'oid':
			return NAMESPACE_OID;

		case 'x500':
			return NAMESPACE_X500;

		case 'null':
		case null:
			return NAMESPACE_NULL;

		default:
			return uuidFromString(namespace);
		}
	}

	return namespace;
}

function createUUIDv5(namespace, name, binary) {
	namespace = getNamespace(namespace);

	if(!Buffer.isBuffer(name)) {
		name = new Buffer(name, 'utf8');
	}

	var uuid = createUUIDv5Binary(namespace, name);
	if(!binary) {
		uuid = uuidToString(uuid);
	}

	return uuid;
}

createUUIDv5.uuidToString = uuidToString;
createUUIDv5.uuidFromString = uuidFromString;


module.exports = createUUIDv5;
