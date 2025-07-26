import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as xit from '../../src/index.ts';

const fileInputContent = readFileSync(resolve(__dirname, './data/input.xit'), 'utf-8');

console.log('\ntoObject:\n');
console.log(JSON.stringify(xit.toObject(fileInputContent), null, 2));

// TODO - We must mocke the uuid generation to have a stable output
