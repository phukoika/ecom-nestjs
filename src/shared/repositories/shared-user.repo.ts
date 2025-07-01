import { Injectable } from '@nestjs/common'
import { UserType } from 'src/shared/models/shared-user.model'
import { PrismaService } from 'src/shared/services/prisma.service'

type WhereUniqueUserType = { id: number; [key: string]: any } | { email: string; [key: string]: any }
@Injectable()
export class SharedUserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async findUnique(where: WhereUniqueUserType): Promise<UserType | null> {
    return this.prismaService.user.findUnique({
      where,
    })
  }
  update(where: WhereUniqueUserType, data: Partial<UserType>): Promise<UserType | null> {
    return this.prismaService.user.update({
      where,
      data,
    })
  }
}
