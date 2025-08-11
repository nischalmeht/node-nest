import {
    Controller,
    Delete,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
  } from '@nestjs/common';
  import { FileService } from './file.service';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  
@Controller('file')
export class FileController {
    constructor(private readonly fileUploaderService: FileService) {}

    @Post()
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, callback) => {
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
          },
        }),
      }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      return this.fileUploaderService.uploadFile(file);
    }
  
    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
      return this.fileUploaderService.deleteFile(id);
    }
}
