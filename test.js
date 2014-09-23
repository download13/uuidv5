var assert = require('assert');
var uuidv5 = require('./uuid');

// TODO: Tests for the translation functions too
describe('UUIDv5', function() {
	it('makes DNS uuids', function() {
		var r = uuidv5('dns', 'www.example.org');

		assert.equal(r, '74738ff5-5367-5958-9aee-98fffdcd1876');
	});

	it('makes URL uuids', function() {
		var r = uuidv5('url', 'http://example.org/page');

		assert.equal(r, '6b19973b-8154-5782-bca0-15e6b730ca00');
	});

	it('makes OID uuids', function() {
		var r = uuidv5('oid', '1.3.6.1.2.1');

		assert.equal(r, '2a7086de-bbf9-5cb9-9a66-a9e928c26504');
	});

	it('makes X.500 uuids', function() {
		var r = uuidv5('oid', 'uid=user,ou=people,dc=example,dc=com');

		assert.equal(r, '075749ab-61eb-54ec-807d-863ebd6f271a');
	});

	it('can return a Buffer', function() {
		var r = uuidv5('url', 'http://example.org/page', true);
		var compare = uuidv5.uuidFromString('6b19973b-8154-5782-bca0-15e6b730ca00');

		assert.deepEqual(r.toJSON(), compare.toJSON());
	});
});
