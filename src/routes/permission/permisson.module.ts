import { Module } from '@nestjs/common'
import { PermissionController } from 'src/routes/permission/permission.controller'
import { PermissionRepository } from 'src/routes/permission/permission.repo'
import { PermissionService } from 'src/routes/permission/permission.service'
import { SharedModule } from 'src/shared/shared.module'

@Module({
  imports: [SharedModule],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionService],
})
export class PermissionModule {}
