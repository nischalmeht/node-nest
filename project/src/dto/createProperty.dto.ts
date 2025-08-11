// 

import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePropertyDto {
  @IsString({ groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create'] })
  title: string;

  @IsString({ groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create'] })
  content: string;

  @IsString({ groups: ['create', 'update'] })
  @IsNotEmpty({ groups: ['create'] })
  authorName: string;
}
