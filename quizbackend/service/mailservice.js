const nodemailer=require('nodemailer');
const dotenv=require('dotenv');
dotenv.config();

const transport=nodemailer.createTransport({
    service:"gmail",
   

    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.GPASS
    }

})


const sendResetEmail = async (email, token,username) => {
  const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${frontendBaseUrl}/reset/${token}`;
   
  try {
    
  
  await transport.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset",
    html: `
       <h3>Hello ${username},</h3>
      <h3>Reset Your Password</h3>
      <p>Click below link:</p>
      <a href="${link}" target="_blank" rel="noopener noreferrer">Reset Password</a>
      <p>If button doesn't open, copy this URL:</p>
      <p>${link}</p>
      <p>Valid for 10 minutes</p>
    `
  });
  
  console.log("Email sent");

  } catch (err) {
    console.error("MAIL ERROR:", err);
  }
};

module.exports = { sendResetEmail };
