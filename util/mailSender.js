const nodemailer = require("nodemailer");

const mailSender = async (userEmail, randomPassword, username) => {
  const mailHTML = `
  <body style="background-color: black">
  <div style="margin-left: auto; margin-right: auto; width: 60rem">
    <h1 style="color: #ffe369; text-align: center; font-size: 50px">
      Mood Enhancer
    </h1>
    <div>
      <h1 style="text-align: center; color: white; margin-bottom: 2rem">
        😔 >>> 😆
      </h1>
    </div>
    <div style="width: auto; height: auto; background-color: #90caf9">
      <div
        style="
          width: auto;
          height: 120px;
          text-align: center;
          margin: 20px;
          padding: 30px;
        "
      >
        <h1>${username},</h1>
        <h1>
          <em>Your New Mood Enhancer Password is :-</em>
          <b> ${randomPassword}</b>
        </h1>
      </div>
    </div>
  </div>
</body>
`;

  //Step 1
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  // Step 2
  let mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Reset Password",
    text: "Reset Password",
    html: mailHTML,
  };
  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = { mailSender };
