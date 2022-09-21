#!/usr/bin/env node

import chalk from 'chalk'

require('yargonaut')
  .style('yellow')
  .errorsStyle('red')

require('yargs/yargs')(process.argv.slice(2))
  .env('READINGRABBIT')
  .commandDir('commands')
  .demandCommand()
  .help()
  .usage(
    chalk.green(`\xa0\xa0\xa0__     __
\xa0\xa0/_/|   |\\_\\
\xa0\xa0\xa0|U|___|U|
\xa0\xa0\xa0| _   _ |
\xa0\xa0\xa0||,| |,||
\xa0\xa0( == Y == )
\xa0\xa0\xa0|  U U  |

\xa0READING RABBIT`)).argv
