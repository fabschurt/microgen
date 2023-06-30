#!/usr/bin/env node
import { docopt } from 'docopt'
import buildProject from '#src/index'

const params = docopt(`
A minimalist staticgen for generating simple, single-page websites.

Usage: microgen [--lang=<lang>] <src-dir> <build-dir>
`)

buildProject(
  params['<src-dir>'],
  params['<build-dir>'],
  params['--lang'],
  process.env,
)
