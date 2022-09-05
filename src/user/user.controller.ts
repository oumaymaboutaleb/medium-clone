import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { UserService } from "@app/user/user.service";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserResponseInterface } from "./types/userResponse.interface";

import { LoginUserDto } from "@app/user/dto/loginUser.dto";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { BackendValidationPipe } from "@app/shared/pipes/backendValidation.pipe";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post("users")
  @UsePipes(new BackendValidationPipe())
  // CreateUserDto is a class for dto
  async createUser(
    @Body("user") createUserDto: CreateUserDto
  ): Promise<UserResponseInterface> {
    console.log("createUser", createUserDto);
    const user = await this.userService.creatUser(createUserDto);
    return this.userService.builtUserResponse(user);
  }

  @Post("users/login")
  @UsePipes(new BackendValidationPipe())
  async login(
    @Body("user") loginDto: LoginUserDto
  ): Promise<UserResponseInterface> {
    console.log("loginDto", loginDto);

    const user = await this.userService.login(loginDto);
    return this.userService.builtUserResponse(user);
  }

  @Get("user")
  // when authentification is required
  @UseGuards(AuthGuard)
  // we make this request every single time when we're initialising our frontend
  async currentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
    return this.userService.builtUserResponse(user);
  }

  @Put("user")
  @UseGuards(AuthGuard)
  async updateCurrentUser(
    @User("id") currentUserId: number,
    @Body("user") updateUserDto: UpdateUserDto
  ): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(
      currentUserId,
      updateUserDto
    );
    return this.userService.builtUserResponse(user);
  }
}
