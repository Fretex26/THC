import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import type { UUID } from "crypto";

export class FilmResponseDTO {
    @ApiProperty({
        description: 'The id of the film',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    @IsNotEmpty()
    id!: UUID

    @ApiProperty({
        description: 'The title of the film',
        example: 'The Dark Knight'
    })
    @IsString()
    @IsNotEmpty()
    title!: string
}