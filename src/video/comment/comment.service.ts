import { PrismaService } from '@/prisma.service'
import {
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { CreateCommentDto, UpdateCommentDto } from './dto/comment.dto'

type CommentSort = 'newest' | 'top'

@Injectable()
export class CommentService {
	constructor(private readonly prisma: PrismaService) {}

	async createComment(userId: string, dto: CreateCommentDto) {
		const { text, videoId } = dto

		const video = await this.prisma.video.findUnique({
			where: { id: videoId }
		})

		if (!video) {
			throw new NotFoundException('Видео не найдено')
		}

		const comment = await this.prisma.videoComment.create({
			data: {
				text,
				userId,
				videoId
			},
			include: {
				user: true
			}
		})

		return comment
	}

	async updateComment(
		commentId: string,
		userId: string,
		dto: UpdateCommentDto
	) {
		const comment = await this.prisma.videoComment.findUnique({
			where: { id: commentId }
		})

		if (!comment) {
			throw new NotFoundException('Комментарий не найден')
		}

		if (comment.userId !== userId) {
			throw new ForbiddenException(
				'Вы не можете редактировать этот комментарий'
			)
		}

		const updatedComment = await this.prisma.videoComment.update({
			where: { id: commentId },
			data: {
				text: dto.text
			},
			include: {
				user: true
			}
		})

		return updatedComment
	}

	async deleteComment(commentId: string, userId: string) {
		const comment = await this.prisma.videoComment.findUnique({
			where: { id: commentId }
		})

		if (!comment) {
			throw new NotFoundException('Комментарий не найден')
		}

		if (comment.userId !== userId) {
			throw new ForbiddenException('Вы не можете удалить этот комментарий')
		}

		await this.prisma.videoComment.delete({
			where: { id: commentId }
		})

		return { message: 'Комментарий удален' }
	}

	// async getCommentsByPublicId(publicId: string) {
	// 	const comments = await this.prisma.videoComment.findMany({
	// 		where: {
	// 			video: {
	// 				publicId
	// 			}
	// 		},
	// 		include: {
	// 			user: {
	// 				include: {
	// 					channel: true
	// 				}
	// 			},
	// 			likes: true,
	//     	dislikes: true
	// 		},
	// 		orderBy: {
	// 			createdAt: 'desc'
	// 		}
	// 	})

	// 	return comments
	// }

	async getCommentsByPublicId(
		publicId: string,
		sort: 'newest' | 'top' = 'newest'
	) {
		const video = await this.prisma.video.findUnique({
			where: {
				publicId
			},
			select: {
				id: true,
				channel: {
					select: {
						userId: true,
						name: true,
						avatarUrl: true,
						slug: true
					}
				}
			}
		})

		if (!video) {
			throw new NotFoundException('Видео не найдено')
		}

		const comments = await this.prisma.videoComment.findMany({
			where: {
				videoId: video.id
			},
			include: {
				user: {
					include: {
						channel: true
					}
				},
				likes: true,
				dislikes: true
			},
			orderBy: [
				{
					isPinned: 'desc'
				},
				{
					createdAt: 'desc'
				}
			]
		})

		const author = await this.prisma.user.findUnique({
			where: {
				id: video.channel.userId
			},
			include: {
				channel: true
			}
		})

		const commentsWithAuthorLike = comments.map(comment => {
			const authorLiked = comment.likes.some(
				like => like.userId === video.channel.userId
			)

			return {
				...comment,
				authorLike: authorLiked ? author : null
			}
		})

		if (sort === 'newest') {
			return commentsWithAuthorLike
		}

		return commentsWithAuthorLike.sort((a, b) => {
			// 1. Закреплённый комментарий всегда первый
			if (a.isPinned !== b.isPinned) {
				return Number(b.isPinned) - Number(a.isPinned)
			}

			// 1. Количество лайков
			const likesDiff = b.likes.length - a.likes.length

			if (likesDiff !== 0) {
				return likesDiff
			}

			// 2. Лайк автора видео
			if (!!a.authorLike !== !!b.authorLike) {
				return Number(!!b.authorLike) - Number(!!a.authorLike)
			}

			// 3. Галочка автора комментария
			const aVerified = a.user.channel?.isVerified ?? false
			const bVerified = b.user.channel?.isVerified ?? false

			if (aVerified !== bVerified) {
				return Number(bVerified) - Number(aVerified)
			}

			// 4. Новый комментарий выше
			return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		})

		return commentsWithAuthorLike
	}

	async togglePin(commentId: string, userId: string) {
		const comment = await this.prisma.videoComment.findUnique({
			where: {
				id: commentId
			},
			include: {
				video: {
					include: {
						channel: true
					}
				}
			}
		})

		if (!comment) {
			throw new NotFoundException('Комментарий не найден')
		}

		if (comment.video.channel.userId !== userId) {
			throw new ForbiddenException(
				'Только автор видео может закреплять комментарии'
			)
		}

		// Если комментарий уже закреплён — открепляем
		if (comment.isPinned) {
			return this.prisma.videoComment.update({
				where: {
					id: commentId
				},
				data: {
					isPinned: false
				}
			})
		}

		// Снимаем закрепление с предыдущего комментария
		await this.prisma.videoComment.updateMany({
			where: {
				videoId: comment.videoId,
				isPinned: true
			},
			data: {
				isPinned: false
			}
		})

		// Закрепляем выбранный комментарий
		return this.prisma.videoComment.update({
			where: {
				id: commentId
			},
			data: {
				isPinned: true
			}
		})
	}

	async toggleLike(commentId: string, userId: string) {
		const comment = await this.prisma.videoComment.findUnique({
			where: { id: commentId }
		})

		if (!comment) {
			throw new NotFoundException('Комментарий не найден')
		}

		const existingLike = await this.prisma.commentLike.findUnique({
			where: {
				userId_commentId: {
					userId,
					commentId
				}
			}
		})

		if (existingLike) {
			return this.prisma.commentLike.delete({
				where: {
					id: existingLike.id
				}
			})
		}

		await this.prisma.commentDislike.deleteMany({
			where: {
				userId,
				commentId
			}
		})

		return this.prisma.commentLike.create({
			data: {
				userId,
				commentId
			}
		})
	}

	async toggleDislike(commentId: string, userId: string) {
		const comment = await this.prisma.videoComment.findUnique({
			where: { id: commentId }
		})

		if (!comment) {
			throw new NotFoundException('Комментарий не найден')
		}

		const existingDislike = await this.prisma.commentDislike.findUnique({
			where: {
				userId_commentId: {
					userId,
					commentId
				}
			}
		})

		if (existingDislike) {
			return this.prisma.commentDislike.delete({
				where: {
					id: existingDislike.id
				}
			})
		}

		await this.prisma.commentLike.deleteMany({
			where: {
				userId,
				commentId
			}
		})

		return this.prisma.commentDislike.create({
			data: {
				userId,
				commentId
			}
		})
	}
}
