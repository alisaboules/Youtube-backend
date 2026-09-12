import { Injectable } from '@nestjs/common'
import { EnumVideoPlayerQuality } from '@/video/dto/video.types'
import { path as appRootPath } from 'app-root-path'
import ffmpeg = require('fluent-ffmpeg')
import { ensureDir, remove, writeFile } from 'fs-extra'
import * as path from 'path'
import { generateFilename } from './generate-filename'
import { IFile, IMediaResponse } from './media.interface'

const ffmpegPath = require('ffmpeg-static')
const ffprobePath = require('ffprobe-static').path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

@Injectable()
export class MediaService {
  private readonly _outputDir = path.join(appRootPath, 'uploads')

  private processingStatus: Map<string, number> = new Map()

  async saveMedia(
    files: IFile[],
    folder = 'default'
  ): Promise<IMediaResponse[]> {
    const folderLowerCase = folder.toLowerCase()

    const uploadFolder = path.join(
      this._outputDir,
      folderLowerCase
    )

    await ensureDir(uploadFolder)

    const file = files[0]

    if (!file) {
      throw new Error('Файл не найден')
    }

    const uniqueFileName = generateFilename(file.originalname)

    if (this.isVideo(file)) {
      const tempPath = path.join(
        uploadFolder,
        uniqueFileName
      )
      await writeFile(tempPath, file.buffer)
      const maxResolution = EnumVideoPlayerQuality['1080p']
      this.processingStatus.set(uniqueFileName, 0)
      this.processVideo(tempPath, uniqueFileName)
        .then(async () => {
          this.processingStatus.set(uniqueFileName, 100)
          await remove(tempPath)
        })
        .catch(err => {
          this.processingStatus.set(uniqueFileName, -1)
          console.error(
            'Ошибка при обработке видео:',
            err
          )
        })
      return [
        {
          url: `/uploads/videos/1080p/${uniqueFileName}`,
          name: uniqueFileName,
          maxResolution
        }
      ]
    }

    const filePath = path.join(
      uploadFolder,
      uniqueFileName
    )
    await writeFile(filePath, file.buffer)
    return [
      {
        url: `/uploads/${folderLowerCase}/${uniqueFileName}`,
        name: uniqueFileName
      }
    ]
  }

  private isVideo(file: IFile): boolean {
    return file.mimetype.startsWith('video/')
  }

  private async processVideo(
    inputPath: string,
    fileName: string
  ): Promise<void> {
    const outputDir = path.join(
      this._outputDir,
      'videos',
      EnumVideoPlayerQuality['1080p']
    )

    await ensureDir(outputDir)

    const outputPath = path.join(
      outputDir,
      fileName
    )

    console.log('Начинаем обработку видео')
    console.log('Input:', inputPath)
    console.log('Output:', outputPath)

    return new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .size('1920x1080')
        .output(outputPath)
        .on('start', commandLine => {
          console.log('FFmpeg started:')
          console.log(commandLine)
        })
        .on('progress', progress => {
          const percent = Math.round(
            progress.percent || 0
          )
          console.log('1080p progress:', percent)
          this.processingStatus.set(
            fileName,
            percent
          )
        })
        .on('end', () => {
          console.log(
            'FFmpeg finished: 1080p'
          )
          resolve()
        })
        .on('error', error => {
          console.error(
            'FFmpeg error (1080p):',
            error
          )
          reject(error)
        })
        .run()
    })
  }

  getProcessingStatus(fileName: string): number {
    return this.processingStatus.get(fileName) ?? 0
  }
}