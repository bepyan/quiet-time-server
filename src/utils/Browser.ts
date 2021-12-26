import puppeteer from "puppeteer";

class Browser {
  browser: puppeteer.Browser | undefined;

  loadBrowser() {
    console.log("$$ 브라우저 실행중..");
    puppeteer
      .launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
      .then((browser) => {
        this.browser = browser;
        console.log("$$ 브라우저 구동 완료 ✨");
      });
  }
}

export const BrowserService = new Browser();
