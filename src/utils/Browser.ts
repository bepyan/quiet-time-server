import puppeteer from "puppeteer";

class Browser {
  browser: puppeteer.Browser | undefined;

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
      .then((browser) => {
        this.browser = browser;
        console.log("$$ 브라우저 구동 완료 ✨");
      });
  }
}

export const BrowserService = new Browser();
