import express from 'express';
import { asyncErrorCatcher, decodeRequest, validatorErrorChecker } from '../middlewares';
import { DailyBibleService } from '../services';
import { TBibleType } from '../services/DailyBibleService';

const router = express.Router();

router.use('/', decodeRequest);

router.get(
  '/',
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const date = req.query.date?.toString() ?? new Date();
    const bibleType = (req.query.bible ?? '기본') as TBibleType;

    const [verses, content] = await Promise.all([
      DailyBibleService.getDailyBible({ bibleType, date }),
      DailyBibleService.getDailyBibleContent({ bibleType, date }),
    ]);

    res.send(DailyBibleService.transfer({ verses, content }));
  }),
);

export default router;
