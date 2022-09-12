import express from 'express';
import { asyncErrorCatcher } from '../middlewares';
import { EmailService } from '../services';

const router = express.Router();

router.post(
  '/send-mail',
  asyncErrorCatcher(async (req, res) => {
    await EmailService.sendMail({
      to: 'bepyan@naver.com',
      subject: 'Test',
      html: 'Test',
    });
    res.send('success');
  }),
);

export default router;
