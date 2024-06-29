import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,UseGuards
  //UseGuards,
} from '@nestjs/common';
import { NewPcService } from './pc.service';
import { NewPcDto } from './dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RoleGuard } from 'src/auth/decorator/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/decorator/enums/role.enum';
// import { ApiBearerAuth } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { createReadStream } from 'fs';
import { join } from 'path';
import { query, type Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pcuser')
export class NewPcController {
  constructor(private newPcService: NewPcService) {}
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './images',
        filename: (req, file, cb) => {
          const ext = extname(file?.originalname).toLowerCase();
          if (['.jpg', '.png', '.jpeg'].includes(ext)) {
            cb(null, `${file?.fieldname}-${Date.now()}${ext}`);
          } else {
            cb(new Error('File extension is not allowed'), null);
          }
        },
      }),
    }),
  )
  @Post('add')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(Role.USER)
  addNewPc(@Body() dto: NewPcDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.newPcService.addNewPc(dto, file.path);
  }
  // @Get('get')
  // getNewPc(
  //   @Query('limit') limit: number = 5,
  //   @Query('search') search: string | null = null,
  // ) {
  //   return this.newPcService.getNewPc(limit, search);
  // }
  @Get('get')
  getNewPc() {
    return this.newPcService.getNewPc();
  }
  @Get('images/:filename')
  async openImg(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const filePath = join(process.cwd(), 'images', `${filename}`);
      const readableStream = createReadStream(filePath);

      // Set response headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `inline; filename=${filename}`);

      // Pipe the stream to the response
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error opening image:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error opening image');
    }
  }

  @Get('barcodes/:filename')
  async barcode(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const filePath = join(process.cwd(), 'barcodes', `${filename}`);
      const readableStream = createReadStream(filePath);

      // Set response headers
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', `inline; filename=${filename}`);

      // Pipe the stream to the response
      readableStream.pipe(res);
    } catch (error) {
      console.error('Error opening barcode:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error opening barcode');
    }
  }

  @Put('update')
  pcUserUpdate(
    @Query('userId') userId: string,
    @Body() dto: NewPcDto,
  ) {
    return this.newPcService.pcUserUpdate(userId, dto);
  }

  @Delete('delete/:userId')
  deleteUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.newPcService.deleteUser(userId);
  }

  @Get('search')
  getUser(@Query('userId') userId: string) {
    return this.newPcService.getUser(userId);
  }

  @Get('year')
  async getDateEndUser(@Query('endYear') endYear: string) {
    try {
      // Convert the query parameter to a Date object
      const endYearDate = new Date(endYear);

      // Check if the conversion resulted in a valid date
      if (isNaN(endYearDate.getTime())) {
        throw new Error('Invalid date format');
      }

      // Call the service function with the Date object
      return await this.newPcService.dateEndUser(endYearDate);
    } catch (error) {
      console.log(endYear);
      throw new BadRequestException(error.message);
    }
  }

  

  @Get('action')
  getRecentActions() {
    return this.newPcService.getRecentActions();
  }
  @Get('scanner')
  async getUserScanner(@Query('userId') userId: string) {
    return this.newPcService.getUserScanner(userId);
  }
  @Get('visualize')
  visualize() {
    return this.newPcService.visualize();
  }

  @Put('trash/year/:year')
  trashedUser(@Param('year') year: Date) {
    return this.newPcService.trashedUser(year);
  }
  @Post('restore')
  async restore(@Query('year') year: string) {
    try {
      // Validate the year parameter format
      if (!year) {
        throw new BadRequestException('Year parameter is required');
      }

      // Call the service function with the provided year
      return await this.newPcService.restore(year);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

}
