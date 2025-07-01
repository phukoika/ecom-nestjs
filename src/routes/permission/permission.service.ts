import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PermissionAlreadyExistsException } from 'src/routes/permission/permission.error'
import {
  CreatePermissionBodyType,
  GetPermissionsQueryType,
  UpdatePermissionBodyType,
} from 'src/routes/permission/permission.model'
import { PermissionRepository } from 'src/routes/permission/permission.repo'
import { NotFoundRecordException } from 'src/shared/error'
import { isNotFoundPrismaError, isUniqueConstraintPrismaError } from 'src/shared/helpers'

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepository) {}

  async list(pagination: GetPermissionsQueryType) {
    const data = await this.permissionRepo.list(pagination)
    return data
  }

  async findById(id: number) {
    const data = await this.permissionRepo.findById(id)
    if (!data) {
      throw new NotFoundException('Permission not found')
    }
    return data
  }

  async create({ createdById, data }: { createdById: number | null; data: CreatePermissionBodyType }) {
    try {
      return await this.permissionRepo.create({ createdById, data })
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistsException
      }
      throw error
    }
  }

  async update({ id, updatedById, data }: { id: number; updatedById: number | null; data: UpdatePermissionBodyType }) {
    try {
      const Permission = await this.permissionRepo.update({
        id,
        updatedById,
        data,
      })
      return Permission
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      if (isUniqueConstraintPrismaError(error)) {
        throw PermissionAlreadyExistsException
      }
      throw error
    }
  }
}
