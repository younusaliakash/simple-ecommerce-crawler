import puppeteer from 'puppeteer'
//Queue
import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'
import 'dotenv/config'

//database
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
const db = new Low(new JSONFile('ecommerceInfo.json'), {})
await db.read()

const saveToDatabase = async (id, productData) => {
    db.data[id] = productData;
    await db.write();
}

const connection = new Redis(process.env.REDIS_Path, {
    maxRetriesPerRequest: null
})

const browser = await puppeteer.launch({ headless: false })
const page = await browser.newPage()

await page.goto('http://demo.agnidesigns.com/halena/shop/', { waitUntil: 'networkidle0' })
await page.waitForSelector('.product-thumbnail .woocommerce-loop-product__link')
const allProductsLink = await page.evaluate(() => {
    return [...document.querySelectorAll('.product-thumbnail .woocommerce-loop-product__link')].map(el => el.href)
})

const extractProductInfo = (page, selector) => {
    return page.evaluate((selector) => {
        return document.querySelector(selector)?.innerText
    }, selector)
}

//Worker
new Worker('product', async (job) => {
    const link = job.data.url
    console.log(link)

    const page = await browser.newPage()
    await page.goto(link, { waitUntil: 'networkidle2' })

    await page.waitForSelector('.product_title')
    const title = await extractProductInfo(page, '.product_title')
    const description = await extractProductInfo(page, '.woocommerce-product-details__short-description p')
    const price = await extractProductInfo(page, '.price .amount')

    await saveToDatabase (link , { link, title, description, price })
    // console.log({ link, title, description, price })

    await page.close()
}, { connection })


const myQueue = new Queue('product', { connection })

for (let link of allProductsLink) {
    myQueue.add(link, { url: link }, { jobId: link })
}
