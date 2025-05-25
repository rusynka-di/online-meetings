const axios = require('axios');
const qs = require('qs');

async function getZoomAccessToken() {
  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`;

  const auth = Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await axios.post(tokenUrl, null, {
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Помилка при отриманні токена Zoom:', error.response?.data || error.message);
    throw new Error('Не вдалося отримати токен Zoom');
  }
}

module.exports = getZoomAccessToken;
