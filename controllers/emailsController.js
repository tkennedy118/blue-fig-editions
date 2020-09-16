const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSWORD
  }
});

module.exports = {
  send: function(req, res) {
    const mailOptions = req.body;

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        res.status(422).json(err);
      } else {
        res.json(info.response);
      }
    });
  }
};
