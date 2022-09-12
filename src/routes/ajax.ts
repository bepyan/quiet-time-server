import express from 'express';
import { asyncErrorCatcher, decodeRequest, validatorErrorChecker } from '../middlewares';
import { DailyBibleService } from '../services';
import { TBibleType } from '../services/DailyBibleService';

const router = express.Router();

router.use('/', decodeRequest);

router.get(
  '/매일성경',
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const date = req.query.date?.toString() ?? new Date();
    const bibleType = (req.query.bible ?? '기본') as TBibleType;

    const [verses, content] = await Promise.all([
      DailyBibleService.getDailyBible({ bibleType, date }),
      DailyBibleService.getDaliyBibleContent({ bibleType, date }),
    ]);

    res.send({
      ...content,
      verses,
    });
  }),
);

export default router;
