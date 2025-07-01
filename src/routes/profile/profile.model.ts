import { UserSchema } from 'src/shared/models/shared-user.model'
import { z } from 'zod'

export const UpdateProfileBodySchema = UserSchema.pick({
    name: true,
    phoneNumber: true,
    avatar: true,
}).strict()

export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>


export const ChangePasswordBodySchema = UserSchema.pick({
    password: true,
}).extend({
    newPassword: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
}).strict().superRefine(({ newPassword, confirmPassword }, ctx) => {
    if(newPassword !== confirmPassword) {
        ctx.addIssue({
            code: 'custom',
            message: 'New password and confirm password must match',
            path: ['confirmPassword'],
        })
    }
})

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>