/**
 * Simple test script for the parser until I actually get around to writing unit tests and whatnot.
 * Give it an xit file, then use the parser as you would IRL, ezpz.
 */

import * as xit from './src/index.js';
import { readFileSync } from 'fs';

const file = readFileSync('./test.xit', 'utf-8');

console.log('\ntoObject:\n');
console.log(JSON.stringify(xit.toObject(file), null, 2));
console.log('\ntoString:\n');
console.log(xit.toString(xit.toObject(file)));
