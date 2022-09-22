import chalk from 'chalk'
import ora from 'ora'
import { SiteMapPages } from '../types'

const smta = require('sitemap-to-array')
const Crawler = require('crawler')

const spinnerOpts:any = {
  spinner: 'shark',
  color: 'green'
}

export const command = 'ping <sitemap URL>'
export const desc = 'Ping a list of URLs from a sitemap'
export const builder = {}
export const handler = (args: any): Promise<void> => exec(args)

/**
 * Execute the command
 */
const exec = (args: any):any => {
  initMessage()
  const spinner = ora({ text: 'Looking for the sitemap...', ...spinnerOpts }).start()
  const { sitemapURL } = args

  smta(sitemapURL, {returnOnComplete: true}, (error:any, list:any) => {
    if (error) return console.error(error)
    spinner.stop()

    const urls:SiteMapPages[] = list.map((data:SiteMapPages) => data.loc)
    ping(urls)
  })
}


const ping = (urls: any) => {
  let progress = 0
  let spinner = ora({ text:'Hoppin’ through the pages!', ...spinnerOpts }).start()

  const c = new Crawler({
    rateLimit: 50,
    maxConnections: 10,
    jQuery: false,
    // This will be called for each crawled page
    callback: function(error:any, res:any, done:any) {
      progress++
      let progressText = `${progress}/${urls.length}`

      if (error) {
        console.log(error)
      } else {
        spinner.stop()

        const status = res.statusCode === 200 ? chalk.bgGreen(res.statusCode) : chalk.bgRed(res.statusCode)
        console.log(`${status} ${res.options.uri}`)

        spinner = ora({ text:`${progressText} | Hoppin’ through the pages!`, ...spinnerOpts }).start()
      }

      done()
    },
  })

  c.queue(urls)

  c.on('drain', () => {
    spinner.stop()
    console.log(chalk.green(`\n✅All complete!`))
    process.exit(1)
  })
}

/**
 *
 * @returns string
 */
const initMessage = () => {
  return console.log(chalk.green(`\xa0\xa0\\\\
\xa0\xa0\xa0\\\\_
\xa0\xa0\xa0( _\\\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0--
\xa0\xa0\xa0/ \\__\xa0\xa0\xa0\xa0\xa0--\xa0\xa0\xa0\xa0\xa0/\xa0\xa0\\
\xa0\xa0\xa0/ _/\`"\`\xa0\xa0/\xa0\xa0\\\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\\
\xa0\xa0{\\  )_\xa0\xa0\xa0/\xa0\xa0\xa0\xa0\\_/\xa0\xa0\xa0\xa0\xa0\xa0\\
\xa0\xa0\xa0\`"""\`

IT’S PINGIN’ TIME! BRB\n`))
}
