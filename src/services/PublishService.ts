import { IUser, INotion } from '@types';
import { NotionService, QTContentService, UserService } from '.';

export const publishContent = async ({
  notion_auth,
  notion: { database_id, contentType },
}: {
  notion_auth: string;
  notion: INotion;
}) => {
  const content = await QTContentService.findOne({ contentType });

  if (content)
    return NotionService.createQTPage({
      notion_auth,
      database_id,
      content,
    });
};

export const publishToOneUser = async (user: IUser) => {
  const { name, notion_auth, notions } = user;

  let jobs_done = 0;
  for (const notion of notions) {
    try {
      await publishContent({ notion_auth, notion });
      jobs_done++;
    } catch (e) {
      console.log(`$$ delete error notion | ${name} ${notion.database_id} `);
      await UserService.deleteNotion({ name, notion });
    }
  }
  return jobs_done;
};

export const publishToAllUser = async () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('$$ start publishing QT');

  const users = await UserService.findAll();
  const jobs = users.reduce((ac, v) => ac + v.notions.length, 0);
  console.log(`$$ discover ${jobs} jobs`);

  let jobs_done = 0;
  for (const user of users) {
    jobs_done += await publishToOneUser(user);
  }

  console.log(`$$ ${jobs_done} content published ✨`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};
