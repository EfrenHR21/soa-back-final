/* eslint-disable prettier/prettier */
import { Controller,
   Get, 
   Post, 
   Body, 
   Patch, 
   Param, 
   Delete, 
   HttpCode,
   HttpStatus,
   Res,
   Put,
   Query
  } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { Roles } from 'src/shared/middleware/decorators/role.decorator';
import { userTypes } from 'src/shared/schema/users';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUser: {email: string; password: string },
   @Res({ passthrough: true }) response: Response,
  ) {
    const loginRes = await this.usersService.login(
      loginUser.email,
      loginUser.password
    );
    if(loginRes.success){
      response.cookie('_cf_auth_token', loginRes.result?.token, {
        httpOnly: true
      });
    }
    delete loginRes.result?.token;
    return loginRes;
  }

  
  @Get('/verify-email/:otp/:email')
  async verifyEmail(@Param('otp') otp:string, @Param('email') email:string ) {
    const rsp = await this.usersService.confirmedEmail(otp, email);
    return rsp;
  }

  @Get('send-ot-email/:email')
  async sendOtpEmail(@Param('email') email:string ) {
    return await this.usersService.sendOtpEmail(email);
  }

  @Put('/logout')
  async logout(@Res() res: Response) { 
    res.clearCookie('_cf_auth_token');
    return res.status(HttpStatus.OK).json({ "success": true ,message: 'Logout successful' });
  }

  @Get('forgot-password/:email')
  async forgotPassword(@Param('email') email:string ) {
    return await this.usersService.forgotPassword(email); 
  }
  
  @Patch('/update-name-password/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updatePasswordOrName(id, updateUserDto);
  }

  @Get()
  @Roles(userTypes.ADMIN)
  async findAll(@Query('type') type: string) {
    return await this.usersService.findAll(type);
  }
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
