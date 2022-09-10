import axios from 'axios';
import express from 'express';
import moment from 'moment-timezone';
import { asyncErrorCatcher, decodeRequest, validatorErrorChecker } from '../middlewares';

const ajaxURL = 'https://sum.su.or.kr:8888/Ajax/Bible';
const bibleMapper = {
  기본: 'QT1',
  영어: 'QT4',
  순: 'QT6',
  청소년: 'QT2',
  청소년_영어: 'QT9',
  고학년: 'QT3',
  고학년_영어: 'QT10',
  저학년: 'QT7',
  저학년_영어: 'QT5',
  큐티아이: 'QT8',
};

const router = express.Router();

router.use('/', decodeRequest);

router.get(
  '/매일성경',
  validatorErrorChecker,
  asyncErrorCatcher(async (req, res) => {
    const date = req.query.date || moment(new Date()).format('yyyy-MM-DD');
    const bibleType = bibleMapper[(req.query.bible as keyof typeof bibleMapper) ?? '기본'];

    const { data } = await axios.post(ajaxURL + '/BodyBible', {
      qt_ty: bibleType,
      Base_de: date,
    });

    res.send(data);
  }),
);

export default router;
