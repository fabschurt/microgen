#!/usr/bin/env node
import { docopt } from 'docopt'
import microgen from '#src/main'

const params = docopt(`
A minimalist staticgen for generating simple, single-page websites.

Usage: microgen [--lang=<lang>] <src-dir> <build-dir>
`)

microgen(
  params['<src-dir>'],
  params['<build-dir>'],
  params['--lang'],
  process.env,
)
