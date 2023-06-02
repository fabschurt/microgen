#!/usr/bin/env node
import assert from 'node:assert'
import main from '#src/main'

assert.ok(process.argv[2])
assert.ok(process.argv[3])

main(process.argv[2], process.argv[3])
