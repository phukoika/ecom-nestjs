import { BadRequestException, UnprocessableEntityException } from '@nestjs/common'
import { error } from 'console'
import { createZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'

const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (error: ZodError) => {
    return new UnprocessableEntityException(error.errors.map((err) => {
        return {
            ...err,
            path: err.path.join('.'),
        }
    }))
  }
})

export default CustomZodValidationPipe