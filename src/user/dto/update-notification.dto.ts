import { NotificationType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;
}