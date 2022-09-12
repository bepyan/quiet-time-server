import express from 'express';
import { asyncErrorCatcher, decodeRequest, validatorErrorChecker } from '../middlewares';
import { LivingLifeService } from '../services';
import { TBibleType } from '../services/LivingLifeService';

const router = express.Router();

router.use('/', decodeRequest);

router.get(
  '/',
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const date = req.query.date?.toString() ?? new Date();
    const bibleType = (req.query.bible ?? '개역개정') as TBibleType;

    const data = await LivingLifeService.parse({ bibleType, date });

    res.send(data);
  }),
);

export default router;
