import { Body, Controller, Get, HttpCode, HttpStatus, Ip, Post, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { ZodSerializerDto } from 'nestjs-zod'
import {
  ForgotPasswordBodyDTO,
  GetAuthorizationUrlResDTO,
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RegisterBodyDTO,
  RegisterResDTO,
  SendOTPBodyDTO,
} from 'src/routes/auth/auth.dto'
import { LogoutResType, RefreshTokenResType, SendOTPResType } from 'src/routes/auth/auth.model'
import { AuthService } from 'src/routes/auth/auth.service'
import { GoogleService } from 'src/routes/auth/google.service'
import envConfig from 'src/shared/config'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { UserAgent } from 'src/shared/decorators/user-agent.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleService: GoogleService,
  ) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDTO): Promise<RegisterResDTO> {
    const user = await this.authService.register(body)
    return {
      data: user,
      message: 'Đăng ký thành công',
    }
  }

  @Post('otp')
  @IsPublic()
  async sendOTP(@Body() body: SendOTPBodyDTO): Promise<SendOTPResType> {
    const otp = await this.authService.sendOTP(body)
    return {
      data: otp,
      message: 'Mã OTP đã được gửi đến email của bạn',
    }
  }

  @Post('login')
  @IsPublic()
  async login(@Body() body: LoginBodyDTO, @UserAgent() userAgent: string, @Ip() ip: string): Promise<LoginResDTO> {
    const tokens = await this.authService.login({ ...body, userAgent, ip })
    return {
      data: tokens,
      message: 'Đăng nhập thành công',
    }
  }

  @Post('refresh-token')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Body() body: RefreshTokenBodyDTO,
    @UserAgent() userAgent: string,
    @Ip() ip: string,
  ): Promise<RefreshTokenResType> {
    const result = await this.authService.refreshToken({ refreshToken: body.refreshToken, userAgent, ip })
    return {
      data: result,
      message: 'Token đã được cập nhật',
    }
  }

  @Post('logout')
  async logout(@Body() body: LogoutBodyDTO): Promise<LogoutResType> {
    console.log(body)
    const result = await this.authService.logout(body.refreshToken)
    return {
      message: result.message,
    }
  }

  @Get('google-link')
  @IsPublic()
  @ZodSerializerDto(GetAuthorizationUrlResDTO)
  getAuthorizationUrl(@UserAgent() userAgent: string, @Ip() ip: string) {
    return this.googleService.getAuthorizationUrl({ userAgent, ip })
  }

  @Get('google/callback')
  @IsPublic()
  async googleCallback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    try {
      const data = await this.googleService.googleCallback({ code, state })
      return res.redirect(
        `${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?accessToken=${data?.accessToken}&refreshToken=${data?.refreshToken}`,
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi khi đăng nhập bằng Google, vui lòng thử lại bằng cách khác'
      return res.redirect(`${envConfig.GOOGLE_CLIENT_REDIRECT_URI}?errorMessage=${message}`)
    }
  }

  @Post('forgot-password')
  @IsPublic()
  @ZodSerializerDto(MessageResDTO)
  async forgotPassword(@Body() body: ForgotPasswordBodyDTO) {
    return this.authService.forgotPassword(body)
  }
}
