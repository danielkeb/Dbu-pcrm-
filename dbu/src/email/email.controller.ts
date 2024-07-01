import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  Param,
  Patch,
  NotAcceptableException,
  Query,
  HttpStatus,
  NotFoundException,
  HttpCode,
  Get,
} from '@nestjs/common';
import { ShortcodeEmailService } from './email.service';
import { PasswordDto } from './dto/pass.dto';

@Controller('verify')
export class PasswordResetController {
  constructor(private readonly shortcodeEmailService: ShortcodeEmailService) {}

  @Post('/shortcode')
  async verifyCode(@Query('id') id: string, @Body() dto: any) {
    try {
      const result = await this.shortcodeEmailService.verifyCode(id, dto);
      return {
        userId: result.userId,
        statusCode: 200,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { message: 'Invalid or expired short code', statusCode: 406 };
      } else {
        return {
          message: 'An error occurred while verifying the short code',
          statusCode: 500,
        };
      }
    }
  }


  @Patch('/updatePassword')
  async resetPassword(
    @Query('id') id: string,
    @Body() dto: PasswordDto,
  ) {
    await this.shortcodeEmailService.resetPassword(id, dto);
  }
}
