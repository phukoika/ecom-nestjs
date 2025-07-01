import { Injectable } from '@nestjs/common'
import * as OTPAuth from 'otpauth'
import envConfig from 'src/shared/config'
@Injectable()
export class TwoFactorAuthSerivce {
  private createTOTP(email: string) {
    return new OTPAuth.TOTP({
      issuer: envConfig.APP_NAME,
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
    })
  }

  generateTOTPSecret(email: string) {
    const totp = this.createTOTP(email)
    return {
      secret: totp.secret.base32,
      uri: totp.toString(),
    }
  }

  verifyTOTP({ email, code, token }: { email: string; code: string; token: string }) {
    const totp = this.createTOTP(email)
    const delta = totp.validate({
      token,
      window: 1,
    })
    return delta !== null
  }
}
