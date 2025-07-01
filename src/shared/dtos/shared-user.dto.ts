import { createZodDto } from 'nestjs-zod'
import { GetUserProfileResSchema, UpdateProfileResSchema, UserSchema } from '../models/shared-user.model'

export class GetUserProfileResDTO extends createZodDto(GetUserProfileResSchema) {}

export class UpdateUserProfileResDTO extends createZodDto(UpdateProfileResSchema) {}