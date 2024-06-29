import { Injectable, Logger } from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust the import path

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private prisma: PrismaService) {}

  async seed() {
    try {
      const adminUser = {
        id: 8743,
        name: 'John',
        last_name: 'mike',
        email: 'johnmike@gmail.com',
        role: 'admin',
        address: 'Dbu',
        gender: 'Male',
        status: 'active',
        phonenumer: '09216534',
        password: await argon.hash('admin1234'),
      };
      const securityUser = {
        id: 1234,
        name: 'Jane',
        last_name: 'Doe',
        email: 'jane_doe@gmail.com',
        role: 'security',
        address: 'Dbu',
        gender: 'Female',
        status: 'active',
        phonenumer: '0988776655',
        password: await argon.hash('security1234'),
      };

      const existingUser = await this.prisma.users.findMany({
        where: {
          OR: [{ email: adminUser.email }, { email: securityUser.email }],
        },
      });

      if (existingUser.length === 0) {
        await this.prisma.users.createMany({
          data: [adminUser, securityUser],
        });
      } else {
        throw new Error('User already exists');
      }

      return { msg: 'success' };
    } catch (error) {
      this.logger.error(`Seeding failed: ${error.message}`);
      throw new Error(`Seeding failed: ${error.message}`);
    }
  }
}
