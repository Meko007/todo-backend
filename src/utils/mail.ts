import nodemailer from 'nodemailer';
import 'dotenv/config';

export const emailAddress = process.env.EMAIL as string;
const emailPassword = process.env.EMAIL_PASS as string;

export const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: emailAddress,
		pass: emailPassword,
	},
});