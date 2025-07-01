import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { PermissionService } from './permission.service'
import {
  CreatePermissionBodyDTO,
  GetPermissionDetailResDTO,
  GetPermissionsQueryDTO,
  GetPermissionsResDTO,
  UpdatePermissionBodyDTO,
} from 'src/routes/permission/permission.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @ZodSerializerDto(GetPermissionsResDTO)
  getListPermission(@Query() query: GetPermissionsQueryDTO) {
    return this.permissionService.list(query)
  }

  @Get(':id')
  @ZodSerializerDto(GetPermissionDetailResDTO)
  getPermissionDetail(@Param('id') id: number) {
    return this.permissionService.findById(id)
  }

  @Post()
  @ZodSerializerDto(CreatePermissionBodyDTO)
  createPermission(@Body() body: CreatePermissionBodyDTO, @ActiveUser('userId') userId: number) {
    return this.permissionService.create({
      createdById: userId,
      data: body,
    })
  }

  @Put(':id')
  @ZodSerializerDto(UpdatePermissionBodyDTO)
  updatePermission(
    @Param('id') id: number,
    @Body() body: UpdatePermissionBodyDTO,
    @ActiveUser('userId') userId: number,
  ) {
    return this.permissionService.update({
      id,
      updatedById: userId,
      data: body,
    })
  }
}
