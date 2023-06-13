#!/usr/bin/env node
import assert from 'node:assert'
import buildProject from '#src/index'

assert.ok(process.argv[2])
assert.ok(process.argv[3])

buildProject(process.argv[2], process.argv[3])
