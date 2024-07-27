import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
  logger: any;
  constructor(private prisma: PrismaService) {}

  async addNewPc(dto: NewPcDto, photo: string): Promise<Pcuser> {
    const user = await this.prisma.pcuser.findUnique({
      where: { userId: dto.userId },
    });
    const pcSerial = await this.prisma.pcuser.findUnique({
      where: { serialnumber: dto.serialnumber },
    });
    if (user  || pcSerial) {
      throw new ForbiddenException(`User already found`);
    } else {
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128', // Barcode type
        text: dto.userId, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        //includetext: true, // Show human-readable text
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

  async getTiredPcUser() {
    const newPc = await this.prisma.inactive.findMany();
    return newPc;
  }
  async pcUserUpdate(userId: string, dto: NewPcDto) {
    const existuser= await this.prisma.pcuser.findUnique({
      where:{
        userId: userId,
      },
    });
    if(!existuser){
      throw new NotFoundException("user not found");
    }
    if(dto.serialnumber && dto.serialnumber!== existuser.serialnumber){
      const pcSerial= await this.prisma.pcuser.findUnique({
        where:{
          serialnumber: dto.serialnumber,
        },
      });
      if(pcSerial){
        throw new NotAcceptableException("user already found");
      }
    }
    const update= await this.prisma.pcuser.update({
      where: {
        userId: userId,
      },
      data: {
        ...dto,
        serialnumber: dto.serialnumber ?? existuser.serialnumber,
      },
    });
    return { msg: 'user updated successfully' };
  }

  async deleteUser(id: string) {
    const user = await this.prisma.pcuser.delete({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw new NotAcceptableException('user not deleted');
    }

    return { msg: 'user deleted successfully' };
  }
  async getUser(id: string) {
    const user = await this.prisma.pcuser.findUnique({
      where: {
        userId: id,
      },
    });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return user;
  }

  async getUserScanner(userId: string) {
    try {
      const user = await this.prisma.pcuser.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('No PC users found');
      }

      const oneMinuteAgo = new Date(Date.now() - 60000);

      const recentEntry = await this.prisma.recent.findFirst({
        where: {
          userId: userId,
          createdAT: {
            gte: oneMinuteAgo,
          },
        },
        orderBy: {
          createdAT: 'desc',
        },
      });

      if (recentEntry) {
      } else {
        try {
          await this.prisma.recent.create({
            data: {
              userId: user.userId,
            },
          });
        } catch (error) {
          throw new InternalServerErrorException('Failed to create recent user entry');
        }
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching new PC users');
    }
  }
  

  async getRecentActions(){
    const recentAction= await this.prisma.recent.findMany();
    return recentAction;
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

    const tired= await this.prisma.inactive.findMany();
    const tiredStudent=tired.filter((tired)=>tired.description==='Student').length;
    const tiredStaff=tired.filter((tired)=>tired.description==='Staff').length;
    const tiredGuest=tired.filter((tired)=>tired.description==='Guest').length;


    const totalTired= tired.length;
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
      tired: totalTired,
      tiredStd: tiredStudent,
      tiredStaff: tiredStaff,
      tiredGuest: tiredGuest,
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
              throw new Error("Failed to delete pcuser.");
            }
          }
        }
      }
      return { msg: "deactivated successfully" };
    } catch (error) {
      
      throw new Error("Failed to trash users.");
    }
  }
  async dateEndUser(endYear: Date): Promise<any> {
    try {
      // Validate the provided endYear parameter
      if (!(endYear instanceof Date && !isNaN(endYear.getTime()))) {
        this.logger.error('Invalid date provided:', endYear);
        throw new Error('Invalid date');
      }

      // Calculate future year
      const futureYear = new Date(endYear);
      futureYear.setFullYear(endYear.getFullYear() + 1);
      
      // Query users based on date range
      const users = await this.prisma.pcuser.findMany({
        where: {
          endYear: {
            gte: endYear,
            lt: futureYear,
          },
        },
      });
      
      return users;
    } catch (error) {
      // Handle errors gracefully
      this.logger.error('Failed to fetch users by date range:', error);
      throw new Error(`Failed to fetch users by date range: ${error.message}`);
    }
  }

  async dateEndUserTired(endYear: Date): Promise<any> {
    try {
      // Validate the provided endYear parameter
      if (!(endYear instanceof Date && !isNaN(endYear.getTime()))) {
        this.logger.error('Invalid date provided:', endYear);
        throw new Error('Invalid date');
      }

      // Calculate future year
      const futureYear = new Date(endYear);
      futureYear.setFullYear(endYear.getFullYear() + 1);
      
      // Query users based on date range
      const users = await this.prisma.inactive.findMany({
        where: {
          endYear: {
            gte: endYear,
            lt: futureYear,
          },
        },
      });
      
      return users;
    } catch (error) {
      // Handle errors gracefully
      this.logger.error('Failed to fetch users by date range:', error);
      throw new Error(`Failed to fetch users by date range: ${error.message}`);
    }
  }
  
  async restore(year: any): Promise<any> {
    try {
      const yearDate = new Date(year);

      // Validate the provided year parameter
      if (isNaN(yearDate.getTime())) {
        this.logger.error('Invalid date provided:', year);
        throw new Error('Invalid date');
      }

      // Calculate future date
      const futureDate = new Date(yearDate);
      futureDate.setFullYear(yearDate.getFullYear() + 1);

      let users;
      try {
        users = await this.prisma.inactive.findMany({
          where: {
            endYear: {
              gte: yearDate,
              lt: futureDate,
            },
          },
        });
      } catch (error) {
        this.logger.error('Failed to find inactive users:', error);
        throw new Error('Failed to find inactive users.');
      }

      if (users && users.length > 0) {
        for (const user of users) {
          try {
            const inuser = await this.prisma.pcuser.create({
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

            await this.prisma.inactive.delete({
              where: {
                userId: user.userId,
              },
            });
          } catch (error) {
            this.logger.error('Error processing user:', user.userId, error);
            throw new Error('Failed to process user.');
          }
        }
      }

      return { msg: 'Restore success' };
    } catch (error) {
      this.logger.error('Error restoring users:', error);
      throw new Error('Failed to restore users.');
    }
  }
  
  async trashedSingleUser(userId: string): Promise<void> {
    try {
      // Find the user in the pcuser table
      const user = await this.prisma.pcuser.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Create a new record in the inactive table
      const success = await this.prisma.inactive.create({
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

      if (success) {
        // Delete the user from the pcuser table
        await this.prisma.pcuser.delete({
          where: {
            userId: success.userId,
          },
        });
      }

    } catch (error) {
      this.logger.error('Error trashing user:', { userId, error });

      // Rethrow known errors and wrap unknown ones
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException("Unable to trash user");
      }
    }
  }


  async trashedSingleUserTired(userId: string): Promise<void> {
    try {
      // Find the user in the pcuser table
      const user = await this.prisma.inactive.findUnique({
        where: {
          userId: userId,
        },
      });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      // Create a new record in the inactive table
      const success = await this.prisma.pcuser.create({
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

      if (success) {
        // Delete the user from the pcuser table
        await this.prisma.inactive.delete({
          where: {
            userId: success.userId,
          },
        });
      }

    } catch (error) {
      this.logger.error('Error trashing user:', { userId, error });

      // Rethrow known errors and wrap unknown ones
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException("Unable to trash user");
      }
    }
  }

}
