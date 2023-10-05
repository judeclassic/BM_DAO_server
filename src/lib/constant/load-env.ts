import dotEnv from 'dotenv'

const loadEnv = () => {
    dotEnv.config();

    if (process.env.NODE_ENV == 'development') {
        dotEnv.config({ path: '../.env'});
    }
    if (process.env.NODE_ENV == 'production') {
        dotEnv.config({ path: '/home/ubuntu/.env'});
    }
    if (process.env.APP_NAME == null){
        throw new Error('APP_NAME environment variable missing.');
    }
    if (process.env.PORT == null) {
        throw new Error('PORT environment variable missing.');
    }
    if (process.env.MONGODB_URL == null) {
        throw new Error('MONGODB_URL environment variable missing.');
    }
    if (process.env.ACCESS_TOKEN_SECRET == null) {
        throw new Error('ACCESS_TOKEN_SECRET environment variable missing.');
    }
    if (process.env.VERIFY_EMAIL_SECRET == null) {
        throw new Error('VERIFY_EMAIL_SECRET environment variable missing.');
    }
    if (process.env.RESET_PASSWORD_SECRET == null) {
        throw new Error('RESET_PASSWORD_SECRET environment variable missing.');
    }
    if (process.env.USER_AUTHENTICATION_KEY == null) {
        throw new Error('USER_AUTHENTICATION_KEY environment variable missing.');
    }
}

export default loadEnv;