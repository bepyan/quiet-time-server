import express from 'express';
import 매일성경 from './daily-bible';
import 생명의삶 from './living-life';
import craw from './craw';
import qtcontent from './qt-content';
import users from './users';
import test from './test';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'welcome!' });
});

router.use('/daily-bible', 매일성경);
router.use('/living-life', 생명의삶);
router.use('/craw', craw);
router.use('/qt-content', qtcontent);
router.use('/users', users);
router.use('/test', test);

export default router;
