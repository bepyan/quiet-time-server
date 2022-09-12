import { IQTContent } from '@types';
import cheerio from 'cheerio';
import moment from 'moment-timezone';
import { getHTML, Time } from '../utils';

const LINK_생명의삶_해설 = 'https://www.duranno.com/qt/view/explain.asp';

const 역본 = {
  개역개정: 'https://www.duranno.com/qt/view/bible.asp?d=k',
  우리말성경: 'https://www.duranno.com/qt/view/bible.asp?d=w',
};

export type TBibleType = keyof typeof 역본;

// ----------------------------------------------------------------

export const parse = async ({
  bibleType = '개역개정',
  date = new Date(),
}: {
  bibleType?: keyof typeof 역본;
  date?: string | Date;
} = {}): Promise<IQTContent> => {
  const $ = cheerio.load(
    await getHTML(
      역본[bibleType] + `&qtDate=${moment(new Date(date)).format('yyyy-MM-DD')}`,
      'euc-kr',
    ),
  );
  const $commentary = cheerio.load(await getHTML(LINK_생명의삶_해설, 'euc-kr'));

  // 예시
  // 욥기 33 : 1~13
  // 욥기 38 : 39~39:4
  const range = $('h1 em').text().trim();
  const book = range.slice(0, range.indexOf(' '));
  const [startContent, endContent] = range
    .substring(range.indexOf(' '))
    .split('~')
    .map((v) => v.trim());

  const [startCapter, startVerse] = startContent.split(':').map((v) => +v);
  const [endCapter, endVerse] = endContent.includes(':')
    ? endContent.split(':').map((v) => +v)
    : [startCapter, +endContent];

  return {
    contentType: '생명의삶',
    title: $('h1 span').text().trim(),
    range: {
      text: `${book} ${startCapter}:${startVerse} - ${endCapter}:${endVerse}`,
      book,
      start: { capter: startCapter, verse: startVerse },
      end: { caper: endCapter, verse: endVerse },
    },
    date: Time.toYMD(),
    verses: $('.bible')
      .children()
      .map((_, elem) => {
        const $elem = $(elem);
        if (elem.tagName === 'p') return { text: $elem.text().trim() };

        const verse = +$elem.find('th').text().trim();
        const capter = verse > startVerse ? startCapter : endCapter;
        return {
          capter,
          verse,
          text: $elem.find('td').text().trim(),
        };
      })
      .toArray(),
    commentaries: [
      ...$commentary('.bible')
        .children()
        .filter((_, elem) => elem.tagName === 'p')
        .map((_, elem) => $(elem).html())
        .toArray()
        .flatMap((text) => text.replace('&amp;', '&').split('<br>')),
      '',
    ],
  };
};
