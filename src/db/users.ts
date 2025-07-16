import { SignUpRequest } from '../types'
import { User } from './models'

export async function createUser(user: SignUpRequest) {
    return User.create({ email: user.email, name: user.name, password: user.password })
}


export async function getUserByEmail(email: string) {
    return User.findOne({ where: { email } })
}