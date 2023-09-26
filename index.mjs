import puppeteer from 'puppeteer'


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

for (let link of allProductsLink) {
    const page = await browser.newPage()
    await page.goto(link, { waitUntil: 'networkidle0' })

    await page.waitForSelector('.product_title')
    // const title = await page.evaluate(() => {
    //     return document.querySelector('.product_title')?.innerHTML
    // })
    const title = await extractProductInfo(page, '.product_title')
    const description = await extractProductInfo(page, '.woocommerce-product-details__short-description p')
    const price = await extractProductInfo(page, '.price .amount')

    console.log({ link, title, description, price } )

    await page.close()
}

await page.close()
await browser.close()