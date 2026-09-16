import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEmail, IsNotEmpty, IsString, IsUUID } from "class-validator"
import { UUID } from "crypto"

export class CreateUserRequestDto {
    @ApiProperty({
        description: 'The name of the user',
        example: 'Clark Kent'
    })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({
        description: 'The email of the user',
        example: 'clark@kent.com'
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string

    @ApiProperty({
        description: 'The password of the user',
        minLength: 6,
        example: '123456'
    })
    @IsString()
    @IsNotEmpty()
    password!: string

    @ApiProperty({
        description: 'The favorite film ids of the user',
        example: ['2baf70d1-42bb-4437-b551-e5fed5a87abe', '58611129-2dbc-4a81-a72f-77ddfc1b1b49']
    })
    @IsArray()
    @IsUUID('4', { each: true })
    favoriteFilmIds?: UUID[];
}