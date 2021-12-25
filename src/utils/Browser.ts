import puppeteer from "puppeteer";

class Browser {
  browser: puppeteer.Browser | undefined;
  page: puppeteer.Page | undefined;

  loadBrowser() {
    console.log("$$ 브라우저 실행");
    puppeteer
      .launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
      .then((browser) => {
        this.browser = browser;
        browser.newPage().then((page) => (this.page = page));

        console.log("$$ 브라우저 페이지 준비완료 ✨");
      });
  }
}

export const BrowserService = new Browser();
