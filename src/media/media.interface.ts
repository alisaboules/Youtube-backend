import { EnumVideoPlayerQuality } from '@/video/dto/video.types'

export interface IMediaResponse {
	url: string
	name: string
	maxResolution?: EnumVideoPlayerQuality
}

export interface IFile {
	buffer: Uint8Array
	mimetype: string
	originalname: string
}