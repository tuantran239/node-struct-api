import nodemailer from 'nodemailer'
import { config } from 'dotenv'
import mail from '../config/mail'

config()

export type MailConfig = {
  from?: string
  to: string
  subject?: string
  text?: string
  html?: string
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: mail.user,
    pass: mail.password
  }
})

export const sendMail = async (config: MailConfig) => {
  const {
    from = 'noreply@gmail.com',
    to,
    subject = 'Send Mail',
    text = 'This test mail',
    html = '<b>Hello world?</b>'
  } = config
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  })
}
