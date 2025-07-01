import { Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ChangePasswordBodyDTO, UpdateProfileBodyDTO } from 'src/routes/profile/profile.dto'
import { ChangePasswordBodyType } from 'src/routes/profile/profile.model'
import { isUniqueConstraintPrismaError } from 'src/shared/helpers'
import { SharedUserRepository } from 'src/shared/repositories/shared-user.repo'
import { HashingService } from 'src/shared/services/hashing.service'

@Injectable()
export class ProfileService {
  constructor(
    private readonly sharedUserRepository: SharedUserRepository,
    private readonly hashingService: HashingService,
  ) {}
  async getProfile(userId: number) {
    const user = await this.sharedUserRepository.findUnique({
      id: userId,
    })
    if (!user) {
      throw new UnprocessableEntityException([
        {
          field: 'Email không tồn tại',
          path: 'email',
        },
      ])
    }
    return user
  }

  async updateProfile(userId: number, body: UpdateProfileBodyDTO) {
    try {
      return await this.sharedUserRepository.update(
        { id: userId, deletedAt: null },
        {
          ...body,
          updatedById: userId,
        },
      )
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnprocessableEntityException([
          {
            field: 'Email không tồn tại',
            path: 'email',
          },
        ])
      }
      throw error
    }
  }

  async changePassword({ userId, body }: { userId: number; body: Omit<ChangePasswordBodyType, 'confirmNewPassword'> }){
    try {
      const { password, newPassword } = body
      const user = await this.sharedUserRepository.findUnique({
        id: userId,
        deletedAt: null,
      })
      if (!user) {
        throw new UnprocessableEntityException([
            {
              field: 'Email không tồn tại',
              path: 'email',
            },
          ])
      }
      const isPasswordMatch = await this.hashingService.compare(password, user.password)
      if (!isPasswordMatch) {
        throw new UnprocessableEntityException([
            {
              field: 'Mật khẩu không chính xác',
              path: 'password',
            },
          ])
      }
      const hashedPassword = await this.hashingService.hash(newPassword)

      await this.sharedUserRepository.update(
        { id: userId, deletedAt: null },
        {
          password: hashedPassword,
          updatedById: userId,
        },
      )
      return {
        message: 'Password changed successfully',
      }
    } catch (error) {
      if (isUniqueConstraintPrismaError(error)) {
        throw new UnprocessableEntityException([
            {
              field: 'Email không tồn tại',
              path: 'email',
            },
          ])
      }
      throw error
    }
  }
}
