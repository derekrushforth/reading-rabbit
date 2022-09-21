import chalk from 'chalk'
import ora from 'ora'

const smta = require('sitemap-to-array')
const Crawler = require('crawler')

export const command = 'search <sitemap URL> <term> [options]'
export const desc = 'URL of the website’s sitemap.xml. Normally found at the root of a webpage.'
export const builder = {
  'case-sensitive': {
    type: 'boolean',
    describe: '',
    alias: 'c'
  }
}
export const handler = (args: any): Promise<void> => exec(args)

/**
 * Execute the command
 */
const exec = (args: any):any => {
  // console.log(args)
  initMessage()
  const spinner = ora('Looking for the sitemap...').start()
  const { sitemapURL, term } = args

  // TODO: validate sitemapURL

  smta(sitemapURL, {returnOnComplete: true}, (error:any, list:any) => {
    if (error) return console.error(error)
    spinner.stop()

    const urls:pages[] = list.map((data:pages) => data.loc)
    read(urls, term, )
  })
}

/**
 *
 * @param urls
 * @param term
 * @param spinner
 */
const read = (urls: any, term: string) => {
  let spinner = ora('Reading through pages...').start()

  var c = new Crawler({
    rateLimit: 800,
    maxConnections: 3,
    // This will be called for each crawled page
    callback: function (error:any, res:any, done:any) {
      if (error) {
        console.log(error)
      } else {
        var $ = res.$
        var match = $('*').html().search(term)
        if (match >= 0) {
          spinner.stop()
          console.log(`${res.options.uri}`)
          spinner = ora('Reading through pages...').start()
        }
      }

      done()
    },
  })

  c.queue(urls)

  c.on('drain',function(){
    spinner.stop()
    console.log(chalk.green(`\n✅ All complete! May I have my carrot back?`))
    process.exit(1)
});
}

/**
 *
 * @returns string
 */
const initMessage = () => {
  return console.log(chalk.green(`\xa0\xa0\xa0__     __
\xa0\xa0/_/|   |\\_\\
\xa0\xa0\xa0|U|___|U|
\xa0\xa0\xa0| _   _ |
\xa0\xa0\xa0||,| |,||\xa0\xa0\xa0\_\\/_
\xa0\xa0( == Y == )\xa0\xa0\\  /
\xa0\xa0\xa0|  U U  |\xa0\xa0\xa0\xa0\\/

Here! Hold my carrot!\n`))
}

export interface pages {
  loc: string
}