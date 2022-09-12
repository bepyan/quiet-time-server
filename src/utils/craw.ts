import axios from 'axios';
import iconv from 'iconv-lite';

export const getHTML = async (url: string, encoding = 'utf-8') => {
  const html = await axios({
    url,
    method: 'GET',
    responseEncoding: 'binary',
    responseType: 'arraybuffer',
  });
  return iconv.decode(html.data, encoding);
};
