import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from 'src/shared/config'

import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class EmailService {
  private resend: Resend
  private otpTemplate: string

  constructor() {
    this.resend = new Resend(envConfig.RESEND_API_KEY)

    const templatePath = path.resolve(process.cwd(), 'src/shared/email-templates/otp.html')
    this.otpTemplate = fs.readFileSync(templatePath, 'utf8')
  }

  async sendOTP(payload: { email: string; code: string }) {
    const htmlContent = this.otpTemplate.replace('{{OTP_CODE}}', payload.code)

    return this.resend.emails.send({
      from: 'Pixie Eco [no-reply] <noreply@phukoika.site>',
      to: [payload.email],
      subject: 'Mã OTP',
      html: htmlContent,
    })
  }
}
