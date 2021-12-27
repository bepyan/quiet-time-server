import puppeteer from "puppeteer";
import { links } from "../services/CrawlerService";

class Browser {
  browser: puppeteer.Browser | undefined;
  매일성경page: puppeteer.Page | undefined;

  loadBrowser() {
    console.log("$$ 브라우저 여는중..");
    puppeteer
      .launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--single-process",
        ],
      })
      .then(async (browser) => {
        this.browser = browser;
        console.log("$$ 브라우저 구동 완료 ✨");
        const page = await browser.newPage();

        await page.goto(links.매일성경, { waitUntil: "load", timeout: 0 });
        this.매일성경page = page;

        console.log("$$ 매일성경 접속 완료 ✨");
      });
  }
}

export const BrowserService = new Browser();
