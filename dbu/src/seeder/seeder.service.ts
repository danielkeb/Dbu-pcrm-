import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Adjust the import path
import * as argon from 'argon2';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(private prisma: PrismaService) {}

  async seed() {
    try {
      const hash = await argon.hash('admin1234');
      const existingUser = await this.prisma.users.findUnique({
        where: { email: 'john@gmail.com' },
      });

      if (!existingUser) {
        await this.prisma.users.create({
          data: {
            id:8743,
            name: 'John',
            email: 'johnmike@gmail.com',
            role: 'admin',
            last_name: 'mike',
            address: 'Dbu',
            gender: 'Male',
            status: 'active',
            phonenumer: '09216534',
            password: hash,
          },
        });
      }

      return { msg: 'success' };
    } catch (error) {
      this.logger.error(`Seeding failed: ${error.message}`);
      throw new Error(`Seeding failed: ${error.message}`);
    }
  }
}
