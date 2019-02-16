require('dotenv').config()

const keyId = process.env.REACT_APP_ACCESS_KEY_ID
const accessKey = process.env.REACT_APP_SECRET_ACCESS_KEY
const session = process.env.REACT_APP_SESSION_TOKEN
const bucket = process.env.REACT_APP_BUCKET_NAME
const region = process.env.REACT_APP_REGION_NAME

export default {keyId, accessKey, session, bucket, region}