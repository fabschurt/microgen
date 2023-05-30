#!/usr/bin/env node
import assert from 'node:assert'
import * as fs from '#src/fs'
import createPugRenderer from '#src/render'
import buildProject from '#src/build'

assert.ok(process.argv[2])
assert.ok(process.argv[3])

const
  prefixPathWithSrcDir = await fs.createDirPrefixer(process.argv[2]),
  prefixPathWithBuildDir = await fs.createWritableDirPrefixer(process.argv[3])

buildProject(
  prefixPathWithSrcDir,
  prefixPathWithBuildDir,
  createPugRenderer(prefixPathWithSrcDir),
  fs.copyFile,
  fs.writeToFile,
)
