import { Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import Groq from 'groq-sdk';
import * as pdf from 'pdf-parse';
import { isJSON } from 'validator'; // You may need to install this package

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Upload a file and get a summary of the resume
   * @param file - The file to upload
   * @returns The summary of the resume
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10000000 }),
        new FileTypeValidator({ fileType: 'application/pdf' }),
      ],
    })
  ) file: Express.Multer.File) {
    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    try {
      const data = await pdf(file.buffer);
      
      const prompt = `
        Please return only a valid JSON structure with the following format:
        {
          "firstName": null,
          "lastName": null,
          "contactInformation": null,
          "linkedIn": null,
          "github": null,
          "email": null,
          "phone": null,
          "jobTitle": null,
          "personalSummary": null,
          "professionalExperience": null,
          "technicalSkills": null,
          "softSkills": null,
          "education": null,
          "certifications": null,
          "languages": null
        }
        
        Do not include any extra text, comments, or explanations. The response should be JSON formatted and ready to be used in JSON.parse().

      `;

      

      const chatCompletion = await client.chat.completions.create({
        messages: [{ role: 'user', content: prompt + data.text }],
        model: 'llama3-8b-8192',
      });
    
      const text = chatCompletion.choices[0].message.content;

      const cleanedText = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
      // Check if the response is valid JSON
      if (!isJSON(cleanedText)) {
        throw new HttpException('Invalid JSON response from Groq API', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      try {
        const jsonObject = await JSON.parse(cleanedText);
        return {
          message: 'File uploaded successfully',
          groqResponse: jsonObject,
        };
      } catch (jsonError) {
        throw new HttpException('File uploaded, but Groq API call failed trying to parse the response, please try again!', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      throw new HttpException('File upload failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
