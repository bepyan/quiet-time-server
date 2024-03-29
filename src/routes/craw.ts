import express from 'express';
import { asyncErrorCatcher, decodeRequest, validatorErrorChecker } from '../middlewares';
import { getHTML } from '../utils';

const router = express.Router();

router.use('/', decodeRequest);

router.get(
  '/',
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const url = req.query.url?.toString() ?? '';

    const data = await getHTML(url);
    res.send(data);
  }),
);

export default router;
