import { IQTContent, SearchQTContentDTO } from '@types';
import { DailyBibleService, EmailService, LivingLifeService } from '.';
import { generateError } from '../middlewares';
import { QTContentModel } from '../models';
import { Time } from '../utils';

export const findAll = () => {
  return QTContentModel.find();
};

export const findOne = async ({ contentType, date = Time.toYMD() }: SearchQTContentDTO) => {
  const databaseContent: IQTContent | null = await QTContentModel.findOne({
    contentType,
    date,
  });
  if (!!databaseContent) return databaseContent;

  // const yesterdayContent: IQTContent | null = await QTContentModel.findOne({
  //   contentType,
  //   date: Time.toYesterday(date),
  // });

  // // const content = await CrawlerService.parse(contentType);

  // if (!content || (yesterdayContent && content.title === yesterdayContent.title))
  throw generateError({
    status: 500,
    message: '데이터 수집과정에서 에러가 발생했습니다.',
  });

  // await createOne(content);
  // return content;
};

export const createOne = (content: IQTContent) => {
  return new QTContentModel(content).save();
};

export const deleteOne = ({ contentType, date }: SearchQTContentDTO) => {
  return QTContentModel.deleteOne({ contentType, date });
};

export const deleteToday = () => {
  return QTContentModel.deleteMany({ date: Time.toYMD() });
};

/* ----------------  ---------------- */

export const collectContent = async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const { deletedCount } = await deleteToday();
  console.log(`$$ clean today's ${deletedCount} contents`);

  // console.log(`$$ start collect [ ${CrawlerService.crawlerKeyList.length} ] contents`);

  let done = 0;
  const failMessage: { target: string; error: string }[] = [];

  await Promise.all([
    ...['기본', '순', '영어'].map(async (v) => {
      try {
        const [verses, content] = await Promise.all([
          DailyBibleService.getDailyBible(),
          DailyBibleService.getDailyBibleContent(),
        ]);
        const data = DailyBibleService.transfer({ verses, content });
        await createOne(data);
        done++;
        console.log(`$$ done --- ${done}`);
      } catch (e) {
        if (e instanceof Error) {
          failMessage.push({
            target: '매일성경',
            error: e.stack ?? e.message,
          });
        }
      }
    }),
    async () => {
      const data = await LivingLifeService.parse();
      await createOne(data);
      done++;
      console.log(`$$ done --- ${done}`);
    },
  ]);

  if (failMessage.length > 0) {
    EmailService.sendMail({
      to: 'bepyan@naver.com',
      subject: '[ Quiet Time ] 성경 본문 취합 실패',
      html: `<div>${failMessage.map(
        (v) => `<h>${v.target} 취합 실패</h>\n${v.error}\n\n\n`,
      )}</div>`,
    });
  }

  console.log(`$$ successfully collect ${done} contents ✨`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  return done;
};
