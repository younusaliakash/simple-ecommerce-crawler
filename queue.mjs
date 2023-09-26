import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'
import 'dotenv/config'

const connection = new Redis(process.env.REDIS_Path, {
    maxRetriesPerRequest: null
})

const myQueue = new Queue('product', { connection })

new Worker('product', async (job) => {
    console.log(job.data)
}, { connection })

myQueue.add("product 1", { url: 'http://example.com/#' })

 // const page = await browser.newPage()
    // await page.goto(link, { waitUntil: 'networkidle0' })

    // await page.waitForSelector('.product_title')
    // const title = await page.evaluate(() => {
    //     return document.querySelector('.product_title')?.innerHTML
    // })
    // const title = await extractProductInfo(page, '.product_title')
    // const description = await extractProductInfo(page, '.woocommerce-product-details__short-description p')
    // const price = await extractProductInfo(page, '.price .amount')

    // console.log({ link, title, description, price } )

    // await page.close()