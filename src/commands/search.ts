import chalk from 'chalk'
import ora from 'ora'
import { SiteMapPages } from '../types'

const smta = require('sitemap-to-array')
const Crawler = require('crawler')

const spinnerOpts:any = {
  spinner: 'shark',
  color: 'green'
}

export const command = 'search <sitemap URL> <term> [options]'
export const desc = 'Searches all pages in a sitemap for specific text.'
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
  initMessage()
  const spinner = ora({ text: 'Looking for the sitemap...', ...spinnerOpts }).start()
  const { sitemapURL, term } = args

  // TODO: validate sitemapURL

  // Parse sitemap
  smta(sitemapURL, {returnOnComplete: true}, (error:any, list:any) => {
    if (error) return console.error(error)
    spinner.stop()

    const urls:SiteMapPages[] = list.map((data:SiteMapPages) => data.loc)
    read(urls, term)
  })
}

/**
 * Read through URLs looking for the term
 * @param urls
 * @param term
 * @param spinner
 */
const read = (urls: any, term: string) => {
  let progress = 0
  let spinner = ora({ text: 'Reading...', ...spinnerOpts }).start()

  const c = new Crawler({
    rateLimit: 800,
    maxConnections: 3,
    // This will be called for each crawled page
    callback: function(error:any, res:any, done:any) {
      progress++
      let progressText = `${progress}/${urls.length}`

      if (error) {
        console.log(error)
      } else {
        var $ = res.$
        var match = $('*').html().search(term)
        spinner.stop()

        if (match >= 0) {
          console.log(`${res.options.uri}`)
        }

        spinner = ora({ text:`${progressText} | Reading...`, ...spinnerOpts }).start()
      }

      done()
    },
  })

  c.queue(urls)

  c.on('drain', () => {
    spinner.stop()
    console.log(chalk.green(`\n✅All complete! May I have my carrot back?`))
    process.exit(1)
  })
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