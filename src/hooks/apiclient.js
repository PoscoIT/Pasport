import axios from "axios";

// URL ve diğer yapılandırmaları ortam değişkenlerinden alabilirsiniz
const BASE_URL = process.env.REACT_APP_API_URL;
const AUTH_TOKEN = process.env.REACT_APP_SECRET_KEY;

// Axios istemcisini oluştur
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "auth-token": AUTH_TOKEN,
  },
});

// İstek ve Hata durumları için interceptor ekleme
apiClient.interceptors.request.use(
  (config) => {
    // Her istekten önce ek yapılandırmalar yapılabilir

    return config;
  },
  (error) => {
    // İstek öncesi bir hata oluşursa
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // Başarılı yanıt işleme
    return response;
  },
  (error) => {
    // Hata durumlarını yönetme
    console.error("Response Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
