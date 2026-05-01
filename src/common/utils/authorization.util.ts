import { ForbiddenException } from '@nestjs/common';
import { Types } from 'mongoose';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

export function isAdmin(user: AuthenticatedUser): boolean {
  return user.role === 'ADMIN';
}

export function assertCanAccessUser(
  user: AuthenticatedUser,
  targetUserId: string | Types.ObjectId,
): void {
  if (!isAdmin(user) && user.userId !== targetUserId.toString()) {
    throw new ForbiddenException();
  }
}
