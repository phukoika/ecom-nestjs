import { Controller, Get, Put, Body, Post } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { ChangePasswordBodyDTO, UpdateProfileBodyDTO } from 'src/routes/profile/profile.dto'
import { ProfileService } from 'src/routes/profile/profile.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResDTO } from 'src/shared/dtos/response.dto'
import { GetUserProfileResDTO, UpdateUserProfileResDTO } from 'src/shared/dtos/shared-user.dto'

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ZodSerializerDto(GetUserProfileResDTO)
  getProfile(@ActiveUser('userId') userId: number) {
    return this.profileService.getProfile(userId)
  }

  @Put()
  @ZodSerializerDto(UpdateUserProfileResDTO)
  async updateProfile(@ActiveUser('userId') userId: number, @Body() updateProfileDto: UpdateProfileBodyDTO) {
    const result = await this.profileService.updateProfile(userId, updateProfileDto)
    return {
      data: result,
      message: 'Cập nhật thông tin thành công',
    }
  }

  @Post('/change-password')
  @ZodSerializerDto(MessageResDTO)
  async changePassword(@ActiveUser('userId') userId: number, @Body() changePasswordDto: ChangePasswordBodyDTO) {
    const { message } = await this.profileService.changePassword({ userId, body: changePasswordDto })
    return {
      message,
    }
  }
}
