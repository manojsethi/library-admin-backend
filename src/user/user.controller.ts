// src/user/user.controller.ts
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from 'src/models/user.schema';
import { RolesGuard } from 'src/passport/role.gaurd';
import { PaginationDto, PaginationResult } from 'src/shared/pagination.dto';
import { PaginationService } from 'src/shared/pagination.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly paginationService: PaginationService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  @UseGuards(RolesGuard)
  @Roles(['admin'], true) // Requires the user to have 'admin' role
  @ApiBearerAuth('access-token') // Swagger will use Bearer token for auth endpoints
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully.' })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists.',
  })
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.userService.registerUser(registerUserDto);
  }

  @Post('all')
  @ApiOperation({ summary: 'Retrieve users with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @UseGuards(RolesGuard)
  @Roles(['admin'], true)
  async getUsers(
    @Body() paginationDto: PaginationDto,
  ): Promise<PaginationResult<UserDto>> {
    const data = await this.userService.paginate(paginationDto);
    return data;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the user to delete' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(RolesGuard)
  @Roles(['admin'], true)
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.deleteUser(id);
  }
}
