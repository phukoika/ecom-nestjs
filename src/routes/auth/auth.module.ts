import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { RolesService } from 'src/routes/auth/roles.service'
import { AuthService } from 'src/routes/auth/auth.service'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import { GoogleService } from 'src/routes/auth/google.service'

@Module({
  controllers: [AuthController],
  providers: [RolesService, AuthService, AuthRepository, GoogleService],
})
export class AuthModule {}
