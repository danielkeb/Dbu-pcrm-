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
  const barcodeBaseDir = join(__dirname, '../../../barcodes');

// Ensure the base directory exists
if (!existsSync(barcodeBaseDir)) {
  mkdirSync(barcodeBaseDir, { recursive: true });
}

// Define the full path to save the barcode image
const barcodePath = join(barcodeBaseDir, `${dto.userId.replace(/\//g, '_')}.png`);

// Save the barcode image to the specified path
writeFileSync(barcodePath, barcodeBuffer);

// Generate the relative path for storing in the database
const relativeBarcodePath = `${dto.userId.replace(/\//g, '_')}.png`;

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

  async getUserScanner(id: number) {
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
  async trashedUser(year: any) {
    try {
      // Ensure year is a Date object
      const yearDate = new Date(year);
  
      if (isNaN(yearDate.getTime())) {
        throw new Error('Invalid date');
      }
  
      const futureDate = new Date(yearDate);
      futureDate.setFullYear(yearDate.getFullYear() + 1);
  
      let usersToTrash;
      try {
        usersToTrash = await this.prisma.pcuser.findMany({
          where: {
            endYear: {
              gte: yearDate,
              lt: futureDate,
            },
          },
        });
      } catch (error) {
        console.error("Error finding pcuser records:", error);
        throw new Error("Failed to find pcuser records.");
      }
  
      if (usersToTrash.length !== 0) {
        for (const user of usersToTrash) {
          let inuser;
          try {
            inuser = await this.prisma.inactive.create({
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
          } catch (error) {
            console.error("Error creating inactive user:", error);
            throw new Error("Failed to create inactive user.");
          }
  
          if (inuser) {
            try {
              await this.prisma.pcuser.delete({
                where: {
                  userId: user.userId,
                },
              });
            } catch (error) {
              console.error("Error deleting pcuser:", error);
              throw new Error("Failed to delete pcuser.");
            }
          }
        }
      }
      return { msg: "deactivated successfully" };
    } catch (error) {
      console.error("Error trashing users:", error);
      throw new Error("Failed to trash users.");
    }
  }
  
  
  async restore(year: any) {
    try {
      const yearDate = new Date(year);
  
      if (isNaN(yearDate.getTime())) {
        throw new Error('Invalid date');
      }
  
      const futureDate = new Date(yearDate);
      futureDate.setFullYear(yearDate.getFullYear() + 1);
  
      let users;
      try {
        users = await this.prisma.inactive.findMany({
          where: {
            endYear: yearDate,
          },
        });
      } catch (error) {
        console.error("Error finding inactive users:", error);
        throw new Error("Failed to find inactive users.");
      }
  
      if (users) {
        for (const user of users) {
          let inuser;
          try {
            inuser = await this.prisma.pcuser.create({
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
          } catch (error) {
            console.error("Error creating pcuser:", error);
            throw new Error("Failed to create pcuser.");
          }
  
          if (inuser) {
            try {
              await this.prisma.inactive.delete({
                where: {
                  userId: user.userId,
                },
              });
            } catch (error) {
              console.error("Error deleting inactive user:", error);
              throw new Error("Failed to delete inactive user.");
            }
          }
        }
      }
  
      return { msg: "restore success" };
    } catch (error) {
      console.error("Error restoring users:", error);
      throw new Error("Failed to restore users.");
    }
  }
  
}
