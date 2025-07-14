function getEnvVar(name: keyof typeof process.env) {
    const value = process.env[name]

    if (!value) {
        throw new Error(`Environment variable ${name} is not set`)
    }

    return value
}


export const APP_PORT = getEnvVar('APP_PORT')
export const JWT_SECRET = getEnvVar('JWT_SECRET')