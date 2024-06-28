import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, ResetDto, UpdateDto } from './dto';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import { ShortcodeEmailService } from '../email/email.service';

@Injectable({})
export class AuthService {
  constructor(
    private config: ConfigService,
    private jwt: JwtService,
    private prisma: PrismaService,
    private emailService: ShortcodeEmailService,
  ) {}
  async signUp(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    const findEmail = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (findEmail) {
      throw new ForbiddenException('USER already exists');
    } else {
      const user = await this.prisma.users.create({
        data: {
          id: dto.id,
          email: dto.email,
          role: dto.role,
          name: dto.name,
          last_name: dto.last_name,
          address: dto.address,
          gender: dto.gender,
          status: dto.status,
          phonenumer: dto.phonenumber,
          password: hash,
        },
      });
      delete user.password;
      return user;
    }
  }
  async signIn(dto: AuthDto): Promise<{ access_token: string }> {
    const user = await this.prisma.users.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Icorrect email or password');
    } else {
      const pwMatches = await argon.verify(user.password, dto.password);
      if (!pwMatches) {
        throw new ForbiddenException('Incorrect password');
      }
      // const token = await this.signToken(user.id, user.role);
      return this.signToken(user.id, user.role, user.name, user.email);
    }
  }

  async signToken(
    userId: number,
    role: string,
    name: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      role,
      name,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '100m',
      secret: secret,
    });
    // await this.prisma.users.update({
    //   where:{
    //     email: email,
    //   },
    //   data:{
    //     token: token,
    //   }
    // });
    return {
      access_token: token,
    };
  }

  async updateUser(id: number, dto: UpdateDto){
    const user= await this.prisma.users.update({
      where: {
        id: id,
      },
      data:{
        ...dto,
      }
    });
    if(!user){
      throw new ForbiddenException('update failed');
    }
 return {msq: 'updated success'};
  }
async resetPassword(Id: number, dto: ResetDto){
  const hash = await argon.hash(dto.password);
  const user= await this.prisma.users.update({
    where:{
      id: Id,
    },
    data:{
      password: hash,
    }
  });

  if(!user){
    throw new ForbiddenException('failed reset password');
  }
  return {msg: 'password reset success'};
}
async getAllUsers() {
  const [users, totalUsers, maleUsers, femaleUsers, activeUsers, inactiveUsers] = await Promise.all([
    this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        gender: true,
        status: true,
        // password: true,
      },
    }),
    this.prisma.users.count(),
    this.prisma.users.count({ where: { gender: 'Male' } }),
    this.prisma.users.count({ where: { gender: 'Female' } }),
    this.prisma.users.count({ where: { status: 'active' } }),
    this.prisma.users.count({ where: { status: 'inactive' } }),
  ]);

  // Remove password from each user
  // const sanitizedUsers = users.map(({ password, ...rest }) => rest);

  return {
    // users: sanitizedUsers,
    totalUsers,
    maleUsers,
    femaleUsers,
    activeUsers,
    inactiveUsers,
  };
}

  async searchUser(userid: number): Promise<Users> {
    const existid = await this.prisma.users.findUnique({
      where: { id: userid },
    });
    if (existid) {
      const user = await this.prisma.users.findUnique({
        where: {
          id: userid,
        },
        select: {
          id: true,
          role: true,
          email: true,
          name: true,
          last_name: true,
          password: true,
          gender: true,
          status: true,
          address: true,
          phonenumer: true,
          token: true,
        },
      });
      delete user.password;
      return user;
    } else {
      throw new NotFoundException(`User ${userid} not found`);
    }
  }

  async deleteUser(userid: number) {
    const userId = await this.prisma.users.findFirst({
      where: {
        id: userid,
      },
    });
    if (userId) {
      const user = await this.prisma.users.delete({
        where: {
          id: userid,
        },
      });
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }
  async getAll(): Promise<any> {
    const userList = await this.prisma.users.findMany({
      select: {
        email: true,
        role: true,
      },
    });
    return userList;
  }
  async forgetPasswordShortCode(dto: any) {
    const user = await this.prisma.users.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Incorrect email address!');
    }
    const userId = user.id;

    this.emailService.sendSecurityAlert(user.email, userId);
    return { userId, message: 'send success' };
  }
}
