import nodemailer from 'nodemailer'
import { mailConf } from '../../../config'
import { EmailInfo, emailVerifyTemplate } from './templates/email-template'

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
    user: mailConf.user,
    pass: mailConf.password
  }
})

export const sendMail = async (config: MailConfig, emailInfo: EmailInfo) => {
  const {
    from = 'noreply@gmail.com',
    to,
    subject = 'Verify Email',
    text = 'This test mail',
    html = emailVerifyTemplate(emailInfo)
  } = config
  await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html
  })
}
