import { Injectable } from '@nestjs/common'
import { EnumVideoPlayerQuality } from '@/video/dto/video.types'
import { path as appRootPath } from 'app-root-path'
import ffmpeg = require('fluent-ffmpeg')
import { ensureDir, remove, writeFile, readFile } from 'fs-extra'
import * as path from 'path'
import { generateFilename } from './generate-filename'
import { IFile, IMediaResponse } from './media.interface'
import { SupabaseStorageService } from './supabase-storage.service'
const ffmpegPath = require('ffmpeg-static')
const ffprobePath = require('ffprobe-static').path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)

interface IProcessingInfo {
	status: number
	url?: string
}

@Injectable()
export class MediaService {
	private readonly _outputDir = path.join(appRootPath, 'uploads')

	private processingStatus = new Map<string, IProcessingInfo>()

	constructor(
		private readonly supabaseStorageService: SupabaseStorageService
	) {}

	// async saveMedia(
	//   files: IFile[],
	//   folder = 'default'
	// ): Promise<IMediaResponse[]> {
	//   const folderLowerCase = folder.toLowerCase()

	//   const uploadFolder = path.join(
	//     this._outputDir,
	//     folderLowerCase
	//   )

	//   await ensureDir(uploadFolder)

	//   const file = files[0]

	//   if (!file) {
	//     throw new Error('Файл не найден')
	//   }

	//   const uniqueFileName = generateFilename(file.originalname)

	//   if (this.isVideo(file)) {
	//     const tempPath = path.join(
	//       uploadFolder,
	//       uniqueFileName
	//     )
	//     await writeFile(tempPath, file.buffer)
	//     const maxResolution = EnumVideoPlayerQuality['1080p']
	//     this.processingStatus.set(uniqueFileName, 0)
	//     this.processVideo(tempPath, uniqueFileName)
	//       .then(async () => {
	//         this.processingStatus.set(uniqueFileName, 100)
	//         await remove(tempPath)
	//       })
	//       .catch(err => {
	//         this.processingStatus.set(uniqueFileName, -1)
	//         console.error(
	//           'Ошибка при обработке видео:',
	//           err
	//         )
	//       })
	//     return [
	//       {
	//         url: `/uploads/videos/1080p/${uniqueFileName}`,
	//         name: uniqueFileName,
	//         maxResolution
	//       }
	//     ]
	//   }

	//   const filePath = path.join(
	//     uploadFolder,
	//     uniqueFileName
	//   )
	//   await writeFile(filePath, file.buffer)
	//   return [
	//     {
	//       url: `/uploads/${folderLowerCase}/${uniqueFileName}`,
	//       name: uniqueFileName
	//     }
	//   ]
	// }
	async saveMedia(
		files: IFile[],
		folder = 'default'
	): Promise<IMediaResponse[]> {
		const folderLowerCase = folder.toLowerCase()

		const file = files[0]

		if (!file) {
			throw new Error('Файл не найден')
		}

		const uniqueFileName = generateFilename(file.originalname)

		if (this.isVideo(file)) {
			const tempFolder = path.join(this._outputDir, 'temp')

			await ensureDir(tempFolder)

			const tempPath = path.join(tempFolder, uniqueFileName)

			await writeFile(tempPath, file.buffer)

			const maxResolution = EnumVideoPlayerQuality['1080p']

			this.processingStatus.set(uniqueFileName, {
				status: 0
			})

			console.log('Видео загружено');
			console.log('Имя:', uniqueFileName);
			console.log('Временный файл:', tempPath);
			console.log('Запускаем FFmpeg...');

			this.processVideo(tempPath, uniqueFileName)
				.then(async () => {
					await remove(tempPath)
				})
				.catch(error => {
					this.processingStatus.set(uniqueFileName, {
						status: -1
					})

					console.error('Ошибка при обработке видео:', error)
				})

			return [
				{
					url: uniqueFileName,
					name: uniqueFileName,
					maxResolution
				}
			]
		}

		const storagePath = `${folderLowerCase}/${uniqueFileName}`

		const url = await this.supabaseStorageService.upload(
			Buffer.from(file.buffer),
			storagePath,
			'video/mp4'
		)

		return [
			{
				url,
				name: uniqueFileName
			}
		]
	}

	private isVideo(file: IFile): boolean {
		return file.mimetype.startsWith('video/')
	}

	// private async processVideo(
	//   inputPath: string,
	//   fileName: string
	// ): Promise<void> {
	//   const outputDir = path.join(
	//     this._outputDir,
	//     'videos',
	//     EnumVideoPlayerQuality['1080p']
	//   )

	//   await ensureDir(outputDir)

	//   const outputPath = path.join(
	//     outputDir,
	//     fileName
	//   )

	//   console.log('Начинаем обработку видео')
	//   console.log('Input:', inputPath)
	//   console.log('Output:', outputPath)

	//   return new Promise<void>((resolve, reject) => {
	//     ffmpeg(inputPath)
	//       .size('1920x1080')
	//       .output(outputPath)
	//       .on('start', commandLine => {
	//         console.log('FFmpeg started:')
	//         console.log(commandLine)
	//       })
	//       .on('progress', progress => {
	//         const percent = Math.round(
	//           progress.percent || 0
	//         )
	//         console.log('1080p progress:', percent)
	//         this.processingStatus.set(
	//           fileName,
	//           percent
	//         )
	//       })
	//       .on('end', () => {
	//         console.log(
	//           'FFmpeg finished: 1080p'
	//         )
	//         resolve()
	//       })
	//       .on('error', error => {
	//         console.error(
	//           'FFmpeg error (1080p):',
	//           error
	//         )
	//         reject(error)
	//       })
	//       .run()
	//   })
	// }
	private async processVideo(
		inputPath: string,
		fileName: string
	): Promise<void> {
		const outputDir = path.join(this._outputDir, 'temp', 'processed')

		await ensureDir(outputDir)

		const outputPath = path.join(outputDir, fileName)

		console.log('Начинаем обработку видео')

		return new Promise<void>((resolve, reject) => {
			ffmpeg(inputPath)
				.size('1920x1080')
				.output(outputPath)

				.on('progress', progress => {
					const percent = Math.round(progress.percent || 0)

					this.processingStatus.set(fileName, {
						status: percent
					})
				})

				.on('end', async () => {
					try {
						const videoBuffer = await readFile(outputPath)

						const storagePath = `videos/1080p/${fileName}`

						const url = await this.supabaseStorageService.upload(
							videoBuffer,
							storagePath,
							'video/mp4'
						)

						await remove(outputPath)

						this.processingStatus.set(fileName, {
							status: 100,
							url
						})

						resolve()
					} catch (error) {
						reject(error)
					}
				})

				.on('error', error => {
					console.error('FFmpeg error (1080p):', error)

					reject(error)
				})

				.run()
		})
	}

	// getProcessingStatus(fileName: string): number {
	//   return this.processingStatus.get(fileName) ?? 0
	// }

	getProcessingStatus(fileName: string): IProcessingInfo {
		return (
			this.processingStatus.get(fileName) ?? {
				status: 0
			}
		)
	}
}
