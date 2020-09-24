const router = require('express').Router();
const crypto = require('crypto');
const db = require('../../models');
const emailsController = require('../../controllers/emailsController');
const Mailgun = require('mailgun-js');

// Matches with '/api/email'
router.route('/send')
  .put(emailsController.send);

router.route('/reset-password-request')
.post(async(req, res) => {
    let result;
    const domain = process.env.DOMAIN;

    const mailgun = Mailgun({
      apiKey: process.env.MAILGUN_SECRET_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });

    try {
      // Create hash out of given email.
      const timeInMs = Date.now();
      const hashString = `${req.body.email}${timeInMs}`;
      const secret = process.env.HASH_SECRET;
      const hash = crypto.createHmac('sha256', secret).update(hashString).digest('hex');

      // Check if user is in database.
      const query = await db.User.findOne({ email: req.body.email });
      const response = await db.User.findOneAndUpdate({ _id: query._id }, {
        passwordReset: hash
      });

      if (!response) {
        result = res.send({ error: 'Something went wrong while attempting to reset your password' });
      } else {
        const email = {
          from: `Blue Fig Editions <${process.env.ADMIN_EMAIL}>`,
          to: query.email,
          subject: 'Reset Your Password',
          text: `A password reset has been requested for the Blue Fig Editions account associated with this email address. If you made this request, please click the following link: ${domain}/reset-password/${hash} ... if you didn't make this request, please disregard this email.`,
          html: `<p>A password reset has been requested for the Blue Fig Editions account associated with this email address. If you made this request, please click the following link: <a href="${domain}/reset-password/${hash}" target="_blank">${domain}/reset-password/${hash}</a>.</p><p>If you didn't make this request, please disregard this email.</p>`,
        }

        mailgun.messages().send(email, (error, body) => {
          if (error || !body) {
            result = res.send({ error: 'Something went wrong while attempting to reset your password' });
          } else {
            result = res.send({ success: true });
          }
        })
      }

    } catch (err) {
      // If user doesn't exist, error out.
      result = res.send({ error: 'Something went wrong while attempting to reset your password' });
    }

    return result;
  });

module.exports = router;
