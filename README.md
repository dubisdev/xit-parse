# Xit-Parse

A JavaScript library that can parse [Xit files](https://xit.jotaen.net/).
The primary purpose of this library is to output Xit file contents into JSON, or create Xit-formatted data from JSON.

This package is a fork of the original [xit-parse](https://github.com/DLvalentine/xit-parse) but will
not be backards compatible with the original. There will be two exposed functions, `toObject` and `toString` as it was in the original but the output will be different.

## Getting Started

- Bun (native support for ESM & TypeScript)
- In future releases I will transpile and generate Node.js compatible code, but for now this is a pure ESM library.

### Install the Library

In the working directory of your project, run `bun i @dubisdev/xit-parse` in a command prompt or terminal

### Import the Library

Add `import * as xit from '@dubisdev/xit-parse'` to your code. From there, you can use any of the exposed functions or constants, described below, like so: `xit.toObject(...)`.

## Usage

There are two functions exposed:

- `toObject`: Given an Xit string (assuming you have already read the file to a variable, or have the string in memory), this returns the Xit string represented as an Object.
- `toString`: Given the Xit string represented as an Object, this returns the Xit as a string, that can then be written to file.

## Overview of Expected JSON Schema

The schema is fully typed and documented. It is ready to be used in TypeScript projects.

### Overview

Xit-parse breaks up an Xit file into groups. Xit groups are a title line, followed by any number of items and their details.

In the JSON Schema, A ***group*** is an object that maps unique group name strings to arrays of objects describing each line in that group of Xit data from top to bottom.

Within that **group** should be an array of group items. An **item** is a line in an Xit file that has a **status** (open, in-progress, etc.), **type** (title, item, item-details), **content** (plain content, no modifiers or status data), **rawContent** (raw, unformatted content - the original xit as written), **modifiers** (priority, due date, etc.), and **groupID**. The **groupID** is that unique group name, so that each line can refer to the group it belongs to.

The next section will discuss **item** properties (status, type, and so on) in detail.

## New Spec Types

A file is considered a consecution of `groups` and `blank lines`.
Each `group` is surrounded by one or more blank lines (first and last group are exceptions as the file start/end is not really a blank line).

Ex:

```xit
Group 1
[ ] Item 1
[ ] Item 2
-- Blank line --
Group 2 (empty group with title)
-- Blank line --
-- Blank line --
Group 3
[?] Item 3
[@] Item 4
```

## License and Acknowledgements

- Original code by [David L Valentine](https://github.com/DLvalentine/xit-parse)
- Currently maintained by [David Jiménez](https://github.com/dubisdev)
- XIT Specification by [Jan Heuermann (@jotaen)](https://github.com/jotaen/xit)
