import { Injectable } from '@nestjs/common'
import type { Response } from 'express'

@Injectable()
export class RefreshTokenService {
	readonly EXPIRE_DAY_REFRESH_TOKEN = 7
	readonly REFRESH_TOKEN_NAME = 'refreshToken'

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			path: '/',
			expires: expiresIn,
			secure: true, // true if production
			sameSite: 'lax' // lax if production
		})
	}

	removeRefreshTokenFromResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			path: '/',
			expires: new Date(0),
			secure: true, // true if production
			sameSite: 'lax' // lax if production
		})
	}
}
