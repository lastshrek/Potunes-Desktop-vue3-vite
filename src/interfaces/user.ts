export interface User {
	id: number
	username: string
	nickname: string
	avatar: string
	phone?: string
	gender?: string
	intro?: string
	created_at?: string
	updated_at?: string
}

export interface LoginResponse {
	token: string
	user: User
}
