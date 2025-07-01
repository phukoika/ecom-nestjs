import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from 'src/shared/shared.module'
import { AuthModule } from 'src/routes/auth/auth.module'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import CustomZodValidationPipe from 'src/shared/pipes/custom-zod-validation.pipe'
import { ZodSerializerInterceptor } from 'nestjs-zod'
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter'
import { ProfileModule } from './routes/profile/profile.module'
import { ProfileController } from 'src/routes/profile/profile.controller'
import { ProfileService } from 'src/routes/profile/profile.service'
import { PermissionModule } from 'src/routes/permission/permisson.module'
import { PermissionController } from 'src/routes/permission/permission.controller'
import { PermissionService } from 'src/routes/permission/permission.service'
import { PermissionRepository } from 'src/routes/permission/permission.repo'

@Module({
  imports: [SharedModule, AuthModule, ProfileModule, PermissionModule],
  controllers: [AppController, ProfileController, PermissionController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    { provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    ProfileService,
    PermissionService,
    PermissionRepository,
  ],
})
export class AppModule {}
