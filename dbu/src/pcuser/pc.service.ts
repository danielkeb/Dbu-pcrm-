import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  //NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewPcDto } from './dto';
import { Pcuser } from '@prisma/client';

@Injectable()
export class NewPcService {
  constructor(private prisma: PrismaService) {}

  async addNewPc(dto: NewPcDto, photo: string): Promise<Pcuser> {
    const user = await this.prisma.pcuser.findUnique({
      where: { userId: dto.userId },
    });
    if (user) {
      throw new ForbiddenException(`User already found`);
    } else {
      const newPc = await this.prisma.pcuser.create({
        data: {
          userId: dto.userId,
          firstname: dto.firstname,
          lastname: dto.lastname,
          brand: dto.brand,
          description: dto.description,
          serialnumber: dto.serialnumber,
          image: photo, // Associate the newPc with the user
        },
      });
      if (newPc) {
        return newPc;
      } else {
        throw new ForbiddenException('please provide a newPc');
      }
    }
  }
  // async getNewPc(limit = 5, search: string | null = null) {
  //   const queryOptions: any = {
  //     take: limit, // Limit the number of users returned
  //   };

  //   // If search criteria is provided, add it to the query options
  //   if (search) {
  //     queryOptions.where = {
  //       userId: {
  //         contains: search, // Assuming userId is the field to search for
  //       },
  //     };
  //   }

  //   const newPc = await this.prisma.pcuser.findMany(queryOptions);
  //   return newPc;
  // }
  async getNewPc() {
    const newPc = await this.prisma.pcuser.findMany();
    return newPc;
  }
  async pcUserUpdate(userId: number, dto: NewPcDto) {
    const user = await this.prisma.pcuser.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    if (!user) {
      throw new ForbiddenException('user not updated');
    }
    return { msg: 'user updated successfully' };
  }

  async deleteUser(id: number) {
    const user = await this.prisma.pcuser.delete({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotAcceptableException('user not deleted');
    }

    return { msg: 'user deleted successfully' };
  }
  async getUser(id: number) {
    const user = await this.prisma.pcuser.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }
}
