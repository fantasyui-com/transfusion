const assert = require('assert');
const program = require('./index.js');

const input = [4, [ 1, 2, 3]];
const actual = program.apply(program, input);
const expected = [ 1, 2, 3]

console.info(actual);

assert.deepEqual( actual , expected );
