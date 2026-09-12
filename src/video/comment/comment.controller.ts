import { Auth } from '@/auth/decorators/auth.decorator'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Query,
	Post,
	Put,
	Request
} from '@nestjs/common'
import { CommentService } from './comment.service'
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto'

@Controller('comments')
export class CommentController {
	constructor(private readonly commentService: CommentService) {}

	@Auth()
	@Post()
	async createComment(@Body() dto: CreateCommentDto, @Request() req) {
		const userId = req.user.id
		return await this.commentService.createComment(userId, dto)
	}

	@Auth()
	@Put(':id')
	async updateComment(
		@Param('id') commentId: string,
		@Body() dto: UpdateCommentDto,
		@Request() req
	) {
		const userId = req.user.id
		return await this.commentService.updateComment(commentId, userId, dto)
	}

	@Auth()
	@Delete(':id')
	async deleteComment(@Param('id') commentId: string, @Request() req) {
		const userId = req.user.id
		return await this.commentService.deleteComment(commentId, userId)
	}

	@Get('by-video/:publicId')
	async getCommentsByPublicId(
		@Param('publicId') publicId: string,
		@Query('sort') sort: 'newest' | 'top' = 'newest'
	) {
		return await this.commentService.getCommentsByPublicId(publicId, sort)
	}

	@Auth()
  @Put(':id/pin')
  async togglePin(
    @Param('id') commentId: string,
    @Request() req
  ) {
    const userId = req.user.id
    return await this.commentService.togglePin(
      commentId,
      userId
    )
  }

	@Auth()
	@Put(':id/like')
	async toggleLike(@Param('id') commentId: string, @Request() req) {
		const userId = req.user.id

		return await this.commentService.toggleLike(commentId, userId)
	}

	@Auth()
	@Put(':id/dislike')
	async toggleDislike(@Param('id') commentId: string, @Request() req) {
		const userId = req.user.id

		return await this.commentService.toggleDislike(commentId, userId)
	}
}
