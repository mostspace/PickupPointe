const sendGrid = require("@sendgrid/mail");
const twilio = require("twilio");

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Set SendGrid API Key
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

// Send email using mail body.
const sendMails = async (mailBody) => {
  try {
    // Send email using SendGrid client
    const result = await sendGrid.send(mailBody);
    console.log("Email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

const sendSMS = async (userPhone, code) => {
  try {
    const response = twilioClient.messages.create({
      body: `Pickuppointe testing: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: userPhone,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

// Send verification code
const sendVerificationCode = async (res, email, code) => {
  const mailBody = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "From Pickuppointe.com",
    html: `
      <div style="font-family: Gilroy, Arial, sans-serif; color: #333; line-height: 1.5; background-color: #fff; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;font-size:24px;line-height:30px;color:#001e00">Verify your email address to complete registration</h2>
          <p>Hello,</p>
          <p>Thanks for your interest in joining Pickup Pointe! To complete your registration, we need you to verify your email address.</p>
          <p style="font-size: 18px; color: #333; text-align: center; background-color: #f7f7f7; padding: 10px; border-radius: 5px; margin: 40px 0;">
            <b>Your confirmation code is: <span style="color: #F14445;">${code}</span></b>
          </p>
          <p style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;">If you did not sign up for this account, please ignore this email.</p><br/>
          <p style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;">Thanks for your time,</p>
          <p style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;">The Pickup Pointe Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2024 Pickup Pointe</p>
      </div>
    `,
  };
  await sendMails(mailBody);
};

// Send recover code
const sendRecoverCode = async (res, email, code) => {
  const mailBody = {
    from: process.env.SENDGRID_FROM_EMAIL,
    to: email,
    subject: "Pickuppointe Account Recovery",
    html: `
      <div style="font-family: Gilroy, Arial, sans-serif; color: #333; line-height: 1.5; background-color: #fff; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;font-size:24px;line-height:30px;color:#001e00">Verify your email address to complete registration</h2>
          <p>Hello,</p>
          <p>To recover your email address, please send this code.</p>
          <p style="font-size: 18px; color: #333; text-align: center; background-color: #f7f7f7; padding: 10px; border-radius: 5px; margin: 40px 0;">
            <b>Your recover code is: <span style="color: #F14445;">${code}</span></b>
          </p>
          <p style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;">If you did not sign up for this account, please ignore this email.</p><br/>
          <p style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;">Thanks for your time,</p>
          <p style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;">The Pickup Pointe Team</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© 2024 Pickup Pointe</p>
      </div>
    `,
  };
  await sendMails(mailBody);
};

// Send feedback
const sendFeedback = async (name, email, role, feedback_type, message) => {
  const emailContent = `
    <div style="font-family: Gilroy, Arial, sans-serif; color: #333; line-height: 1.5; background-color: #fff; max-width: 600px; margin: auto; padding: 30px; margin-bottom: 10px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="margin-top:0;margin-bottom:0;font-family:Gilroy,sans-serif;font-weight:normal;font-size:24px;line-height:30px;color:#001e00;text-align:center;" >${feedback_type} from ${name}</h2>
        <div style="padding: 20px 0;">
          <p style="font-size:16px;font-family:Gilroy,sans-serif;"><strong>User Role:</strong> ${role}</p>
          <p style="font-size:16px;font-family:Gilroy,sans-serif;"><strong>Registration Email:</strong> ${email}</p>
          <p style="font-size:16px;font-family:Gilroy,sans-serif;"><strong>Message:</strong> ${message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0; margin-top: 20px;">
        <p style="font-size: 12px; color: #999; text-align: center;">© 2024 Pickup Pointe</p>
    </div>
  `;

  const msg = {
    to: 'help@pickuppointe.com',
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: `New Feedback Received: ${feedback_type}`,
    html: emailContent,
  };

  // Send the email
  return await sendMails(msg);
};

module.exports = {
  sendMails,
  sendSMS,
  sendVerificationCode,
  sendRecoverCode,
  sendFeedback
};