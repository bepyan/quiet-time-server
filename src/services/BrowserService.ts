import puppeteer from 'puppeteer';

export const loadBrowser = async (url: string) => {
  console.log('$$ 브라우저 여는중..');
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
    ],
  });

  const page = await browser.newPage();
  console.log('$$ 브라우저 구동 완료 ✨');

  const loadedHTML = await page.goto(url, { waitUntil: 'load', timeout: 0 });
  console.log('$$ 페이지 접속 완료 ✨');

  return page;
};
