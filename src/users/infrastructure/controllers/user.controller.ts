import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { CreateUserUseCase } from "src/users/application/create/create.usecase";
import { DeleteUserUseCase } from "src/users/application/delete/delete.usecase";
import { FindUserByEmailUseCase } from "src/users/application/read/read.usecase";
import { UpdateUserUseCase } from "src/users/application/update/update.usecase";
import { UserMapperResponse } from "../persistence/mappers/user-response.mapper-orm";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserRequestDto } from "./dtos/create-user.dto";
import { UserResponseDto } from "./dtos/user-response.dto";
import { UpdateUserRequestDto } from "./dtos/update-user.dto";

@ApiTags('Users')
@Controller('users')
export class UserController {

    constructor( 
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
        private readonly findUserByEmailUseCase: FindUserByEmailUseCase
    ) {}
    
    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserRequestDto })
    @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto})
    @Post()
    async create(@Body() createUserDto: CreateUserRequestDto){
        const userResponse = await this.createUserUseCase.execute(createUserDto)
        return UserMapperResponse.toResponse(userResponse)
    }

    @ApiOperation({ summary: 'Find a user by email' })
    @ApiResponse({ status: 200, description: 'User found successfully', type: UserResponseDto})
    @Get(':email')
    async findByEmail(@Param('email') email: string){
        const user = await this.findUserByEmailUseCase.execute(email)
        return UserMapperResponse.toResponse(user)
    }

    @ApiOperation({ summary: 'Update a user' })
    @ApiBody({ type: UpdateUserRequestDto })
    @ApiResponse({ status: 200, description: 'User updated successfully'})
    @Patch()
    async update(@Body() updateUserDto: UpdateUserRequestDto) {
        return this.updateUserUseCase.execute(updateUserDto)
    }

    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'User deleted successfully'})
    @Delete(':email')
    async delete(@Param('email') email: string) {
        return this.deleteUserUseCase.execute(email)
    }
}