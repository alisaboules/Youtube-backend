import { Injectable } from '@nestjs/common'

import { createClient, SupabaseClient } from '@supabase/supabase-js'

@Injectable()
export class SupabaseStorageService {
	private readonly supabase: SupabaseClient

	private readonly bucket =
		process.env.SUPABASE_BUCKET ?? 'youtube'

	constructor() {
		const supabaseUrl = process.env.SUPABASE_URL
		const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

		if (!supabaseUrl || !supabaseKey) {
			throw new Error(
				'SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing'
			)
		}

		this.supabase = createClient(supabaseUrl, supabaseKey)
	}

	async upload(
		buffer: Buffer,
		path: string,
		contentType: string
	): Promise<string> {
		const { error } = await this.supabase.storage
			.from(this.bucket)
			.upload(path, buffer, {
				contentType,
				upsert: false
			})

		if (error) {
			throw new Error(
				`Supabase upload error: ${error.message}`
			)
		}

		const { data } = this.supabase.storage
			.from(this.bucket)
			.getPublicUrl(path)

		return data.publicUrl
	}

	async remove(path: string): Promise<void> {
		const { error } = await this.supabase.storage
			.from(this.bucket)
			.remove([path])

		if (error) {
			throw new Error(
				`Supabase delete error: ${error.message}`
			)
		}
	}
}