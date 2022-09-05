import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "@app/user/dto/createUser.dto";
import { UserEntity } from "@app/user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "@app/config";
import { UserResponseInterface } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/loginUser.dto";
import { compare } from "bcrypt";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async creatUser(createDto: CreateUserDto): Promise<UserEntity> {
    const errorResponse = { errors: {} };
    const userByEmail = await this.userRepository.findOne({
      email: createDto.email,
    });
    const userByUsername = await this.userRepository.findOne({
      username: createDto.username,
    });

    if (userByEmail) {
      errorResponse.errors["email"] = "has already been taken";
    }
    if (userByUsername) {
      errorResponse.errors["username"] = "has already been taken";
    }
    if (userByEmail || userByUsername) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    // newUser is the instance of the user entity
    const newUser = new UserEntity();
    //overiding the newUser with the userdto
    //we assigned all properties from createUser insode our new user
    Object.assign(newUser, createDto);
    console.log("New User", newUser);
    // always saving in the db is with wait because it is async
    return await this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }

  async login(LoginUserDto: LoginUserDto): Promise<UserEntity> {
    const errorResponse = {
      errors: {
        "email or password": "is invalid",
      },
    };
    //check if this user exists with such email
    const user = await this.userRepository.findOne(
      {
        email: LoginUserDto.email,
      },
      { select: ["id", "bio", "email", "password", "username", "image"] }
    );
    if (!user) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const isPasswordCorrect = await compare(
      LoginUserDto.password,
      user.password
    );

    if (!isPasswordCorrect) {
      throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
    }
    delete user.password;
    return user;
  }

  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserEntity> {
    const user = await this.findById(userId);
    //override the user's properties with the updated dto
    // user what object , updateuserDto is the fileds
    Object.assign(user, updateUserDto);
    // the save will updare the user in the db
    return await this.userRepository.save(user);
  }

  generateJwt(user: UserEntity): string {
    return sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      JWT_SECRET
    );
  }
  //we are going to built response for our frontend
  builtUserResponse(user: UserEntity): UserResponseInterface {
    return {
      user: {
        // spreading all the fields from the user
        ...user,
        token: this.generateJwt(user),
      },
    };
  }
}
