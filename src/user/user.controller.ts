import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	Param,
	UsePipes,
	Delete,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { UpdateNotificationDto } from './dto/update-notification.dto'
import { User } from '@prisma/client'
import { CurrentUser } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	@Auth()
	async getProfile(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}

	@UsePipes(new ValidationPipe())
	@Put('profile')
	@HttpCode(200)
	@Auth()
	async updateProfile(
		@CurrentUser('id') id: string,
		@Body() dto: UpdateUserDto
	) {
		return this.userService.updateProfile(id, dto)
	}

	@Put('profile/likes')
	@HttpCode(200)
	@Auth()
	async toggleLike(
		@Body('videoId') videoId: string,
		@CurrentUser() user: User
	) {
		return this.userService.toggleLike(videoId, user.id)
	}

	@Put('profile/dislikes')
	@HttpCode(200)
	@Auth()
	async toggleDislike(
		@Body('videoId') videoId: string,
		@CurrentUser() user: User
	) {
		return this.userService.toggleDislike(videoId, user.id)
	}

	@Get('notification/:channelId')
	@Auth()
	async getNotification(
		@CurrentUser('id') userId: string,
		@Param('channelId') channelId: string
	) {
		return this.userService.getNotification(userId, channelId)
	}

	@Put('notification/:channelId')
	@Auth()
	async updateNotification(
		@CurrentUser('id') userId: string,
		@Param('channelId') channelId: string,
		@Body() dto: UpdateNotificationDto
	) {
		return this.userService.updateNotification(userId, channelId, dto.type)
	}

	@Delete('notification/:channelId')
	@HttpCode(200)
	@Auth()
	async unsubscribe(
		@CurrentUser('id') userId: string,
		@Param('channelId') channelId: string
	) {
		return this.userService.unsubscribe(userId, channelId)
	}
}
