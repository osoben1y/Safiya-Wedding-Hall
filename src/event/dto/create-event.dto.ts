import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString, Min } from "class-validator";
import { Event } from "../../common/enum/event-enum";

export class CreateEventDto {
  @ApiProperty({
    description: "Marosim turi tanlang: Toy, Banket, Osh",
    enum: Event,
    default: Event.Toy,
    example: Event.Banket,
  })
  @IsEnum(Event, { message: "Marosim shu turlardan biri bo'lishi shart: Toy, Banket, Osh" })
  event_name?: Event;

  @ApiProperty({
    description: "Mehmonlar sonini kiriting",
    example: 150,
  })
  @IsInt()
  @Min(1)
  number_of_guests: number;

  @ApiProperty({
    description: "Ofitsiantlar sonini kiriting",
    example: 15,
  })
  @IsInt()
  @Min(1)
  number_of_waiters: number;

  @ApiProperty({
    description: "Marosimni sanasi YYYY-MM-DD formatida kiriting",
    example: "2025-09-10",
  })
  @IsString()
  date: string;
}
