import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";
import { FilmResponseDTO } from "./film-response.dto";

export class UserResponseDto {
    @ApiProperty({
        description: 'The id of the user',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    id!: string

    @ApiProperty({
        description: 'The name of the user',
        example: 'Clark Kent'
    })
    @IsString()
    name!: string

    @ApiProperty({
        description: 'The email of the user',
        example: 'clark@kent.com'
    })
    @IsEmail()
    email!: string

    @ApiProperty({
        description: 'The favorite film ids of the user',
        example: ['2baf70d1-42bb-4437-b551-e5fed5a87abe', '58611129-2dbc-4a81-a72f-77ddfc1b1b49']
    })
    @IsArray()
    @IsUUID('4', { each: true })
    favoriteFilms?: FilmResponseDTO[] = [];
}