import { IsString, IsEmail, IsInt, IsOptional } from 'class-validator';

export class AuthDto {
  @IsInt()
  id: number;
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
  @IsInt()
  id: number;
  
  @IsOptional()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  last_name: string;

  @IsString()
  @IsOptional()
  role: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  phonenumber: string;

  @IsString()
  @IsOptional()
  status: string;
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