import nodemailer from "nodemailer";

const _TRANSPORT_CONFIG = {
  port: 587,
  service: "gmail",
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: "godboy4256@gmail.com",
    pass: "poeopiavxylfcumj",
  },
};

export const authNumGenerater = () => {
  return String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
};

export const emailSend = async (
  from: string,
  email: string,
  subject: string,
  html: string
) => {
  try {
    await nodemailer.createTransport(_TRANSPORT_CONFIG).sendMail({
      from,
      to: `${email}`,
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};
