import express from 'express';
import ajax from './ajax';
import craw from './craw';
import qtcontent from './qt-content';
import users from './users';
import test from './test';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'welcome!' });
});

router.use('/ajax', ajax);
router.use('/craw', craw);
router.use('/qt-content', qtcontent);
router.use('/users', users);
router.use('/test', test);

export default router;
