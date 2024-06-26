import {
  ForbiddenException,
  Injectable,
  NotAcceptableException,
  NotFoundException
  //NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NewPcDto } from './dto';
import { Pcuser } from '@prisma/client';
import { join } from 'path';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import * as bwipjs from 'bwip-js';
@Injectable()
export class NewPcService {
  pcuser: any;
  userRepository: any;
  constructor(private prisma: PrismaService) {}

  async addNewPc(dto: NewPcDto, photo: string): Promise<Pcuser> {
    const user = await this.prisma.pcuser.findUnique({
      where: { userId: dto.userId },
    });
    if (user) {
      throw new ForbiddenException(`User already found`);
    } else {
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128', // Barcode type
        text: dto.userId, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: 'center', // Always good to set this
      });

      // Define the path where the barcode will be saved
      const barcodeDir = join(
        __dirname,
        '../../../barcodes',
        dto.userId.replace(/\//g, '_'),
      );
      const barcodePath = `${barcodeDir}.png`;

      // Ensure the directory exists
      const barcodeBaseDir = join(__dirname, '../../../barcodes');
      if (!existsSync(barcodeBaseDir)) {
        mkdirSync(barcodeBaseDir, { recursive: true });
      }

      // Save the barcode image to the specified path
      writeFileSync(barcodePath, barcodeBuffer);
      const relativeBarcodePath = `barcodes/${dto.userId}.png`;

      const newPc = await this.prisma.pcuser.create({
        data: {
          userId: dto.userId,
          firstname: dto.firstname,
          lastname: dto.lastname,
          brand: dto.brand,
          endYear: dto.endYear,
          status: dto.status,
          description: dto.description,
          serialnumber: dto.serialnumber,
          gender: dto.gender,
          phonenumber: dto.phonenumber,
          pcowner: dto.pcowner,
          image: photo, // Associate the newPc with the user
          barcode: relativeBarcodePath,
        },
      });

      if (newPc) {
        return newPc;
      } else {
        throw new ForbiddenException('please provide a newPc');
      }
    }
  }

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
  async visualize() {
    // Count total number of pcusers
    const pcuser = await this.prisma.pcuser.count();

    // Find all students
    const students = await this.prisma.pcuser.findMany({
      where: {
        description: 'Student',
      },
    });
    const std = students.length;
    const femalestd = students.filter(
      (student) => student.gender === 'Female',
    ).length;
    const malestd = students.filter(
      (student) => student.gender === 'Male',
    ).length;

    // Find all staff
    const staff = await this.prisma.pcuser.findMany({
      where: {
        description: 'Staff',
      },
    });
    const numberofstaff = staff.length;
    const femalestaff = staff.filter(
      (staff) => staff.gender === 'Female',
    ).length;
    const malestaff = staff.filter((staff) => staff.gender === 'Male').length;
    const dbuStaff = staff.filter((staff) => staff.pcowner === 'DBU');
    const personalStaff = staff.filter((staff) => staff.pcowner === 'Personal');

    // Count DBU staff by gender
    const femalestaffDBU = dbuStaff.filter(
      (staff) => staff.gender === 'Female',
    ).length;
    const malestaffDBU = dbuStaff.filter(
      (staff) => staff.gender === 'Male',
    ).length;

    // Count Personal staff by gender
    const femalestaffPersonal = personalStaff.filter(
      (staff) => staff.gender === 'Female',
    ).length;
    const malestaffPersonal = personalStaff.filter(
      (staff) => staff.gender === 'Male',
    ).length;
    const guest = await this.prisma.pcuser.findMany({
      where: {
        description: 'Guest',
      },
    });
    const numberofguest = guest.length;
    const femaleguest = guest.filter(
      (guest) => guest.gender === 'Female',
    ).length;
    const maleguest = guest.filter((guest) => guest.gender === 'Male').length;

    return {
      totalNumberOfPcuser: pcuser,
      NumberOfstudent: std,
      numberOfFemaleStudent: femalestd,
      numberOfMaleStudent: malestd,
      numberOfFemaleStaff: femalestaff,
      numberOfMaleStaff: malestaff,
      totalNumberOfStaff: numberofstaff,
      totalNumberOfGuest: numberofguest,
      femaleGuest: femaleguest,
      maleGuest: maleguest,

      maleNumberOfStaffDbu: malestaffDBU,
      femaleStaffPersonal: femalestaffPersonal,
      femaleStaffDbu: femalestaffDBU,
      maleStaffPersonal: malestaffPersonal,
    };
  }
  async trashedUser(year: Date) {
    try {
      const futureDate = new Date(year);
      futureDate.setFullYear(year.getFullYear() + 1);
      const usersToTrash = await this.prisma.pcuser.findMany({
        where: {
          endYear: {
            gte: new Date(year),
            lt: new Date(futureDate),
          },
        },
      });
  
      if (usersToTrash.length !== 0) {
        for (const user of usersToTrash) {
          // Create inactive user
          const inuser = await this.prisma.inactive.create({
            data: {
              userId: user.userId,
              firstname: user.firstname,
              lastname: user.lastname,
              brand: user.brand,
              description: user.description,
              endYear: user.endYear,
              gender: user.gender,
              serialnumber: user.serialnumber,
              phonenumber: user.phonenumber,
              pcowner: user.pcowner,
              image: user.image,
              barcode: user.barcode,
            },
          });
  
          // Delete pcuser if inactive user creation was successful
          if (inuser) {
            await this.prisma.pcuser.delete({
              where: {
                userId: user.userId,
              },
            });
          }
        }
      }
    } catch (error) {
      console.error("Error trashing users:", error);
      throw new Error("Failed to trash users.");
    }
  }
  async restore(year: Date){
    const users= await this.prisma.inactive.findMany({
      where:{
        endYear: year,
      },
    });

    if(users){
      for(const user of users ){
        await this.prisma.pcuser.create({
          data: {
            userId: user.userId,
            firstname: user.firstname,
            lastname: user.lastname,
            brand: user.brand,
            description: user.description,
            endYear: user.endYear,
            gender: user.gender,
            serialnumber: user.serialnumber,
            phonenumber: user.phonenumber,
            pcowner: user.pcowner,
            image: user.image,
            barcode: user.barcode,
          },
        });
      }
    }
  }
}
