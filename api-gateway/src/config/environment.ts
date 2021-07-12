import * as dotenv from 'dotenv';

dotenv.config();

// APP
export const { NODE_ENV, PORT } = process.env;

// APIs
export const { API_BOOKS_URL, API_LIBRARIES_URL } = process.env;
