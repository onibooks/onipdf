#!/usr/bin/env node

import minimist from 'minimist'
import { commands } from './commands'

;(async () => {
  const args = minimist(process.argv.slice(2))
  const { _, ...options } = args
  
  const command = commands[args._[0] as keyof typeof commands]
  if (typeof command === 'function') {
    try {
      await command(options)
    } catch (error) {
      process.exit(1)
    }
  }
})()