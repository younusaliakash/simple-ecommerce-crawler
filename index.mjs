import puppeteer from 'puppeteer'


const browser = await puppeteer.launch({ headless: false })
const page = await browser.newPage()

await page.goto('http://demo.agnidesigns.com/halena/shop/', { waitUntil: 'networkidle0' })
await page.waitForSelector('.product-thumbnail .woocommerce-loop-product__link')
const allProductsLink = await page.evaluate(() => {
    return [...document.querySelectorAll('.product-thumbnail .woocommerce-loop-product__link')].map(el => el.href)
})

console.log(allProductsLink)

await page.close()
await browser.close()