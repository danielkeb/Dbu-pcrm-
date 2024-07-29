import { IsString, IsEmail, IsInt } from 'class-validator';

export class AuthDto {
  @IsString()
  id: string;
  @IsString()
  
  name: string;
  last_name: string;
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  role: string;

  @IsString()
  password: string;

  @IsString()
  gender: string;

  @IsString()
  address: string;

  @IsString()
  phonenumber: string;

  @IsString()
  status: string;
}

export class UpdateDto {
  @IsString()
  id?: string;
  @IsString()
  name?: string;

  @IsEmail()
  @IsString()
  email?: string;
  
  @IsString()
  last_name?: string;

  @IsString()
  role?: string;

  @IsString()
  password?: string;

  @IsString()
  gender?: string;

  @IsString()
  address?: string;

  @IsString()
  phonenumer?: string;

  @IsString()
  status?: string;
}
export class ResetEmailDto {
  @IsEmail()
  @IsString()
  email: string;
}
export class ResetDto{
  @IsString()
  password: string;
}

export class UpdateDtoProfile {
  @IsString()
  id?: string;
  @IsString()
  name?: string;

  @IsEmail()
  @IsString()
  email?: string;
  
  @IsString()
  last_name?: string;

  @IsString()
  role?: string;

  @IsString()
  password?: string;

  @IsString()
  gender?: string;

  @IsString()
  address?: string;

  @IsString()
  phonenumer?: string;

  @IsString()
  status?: string;
}

export class PasswordDto{
  @IsString()
  newPassword: string;

  @IsString()
  currentPassword: string;
}