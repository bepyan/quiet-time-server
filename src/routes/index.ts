import express from 'express';
import 매일성경 from './매일성경';
import 생명의삶 from './생명의삶';
import craw from './craw';
import qtcontent from './qt-content';
import users from './users';
import test from './test';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'welcome!' });
});

router.use('/매일성경', 매일성경);
router.use('/생명의삶', 생명의삶);
router.use('/craw', craw);
router.use('/qt-content', qtcontent);
router.use('/users', users);
router.use('/test', test);

export default router;
