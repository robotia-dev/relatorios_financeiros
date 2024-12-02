import axios from 'axios';

class ApiService {
  constructor() {
    // Cria uma instância do Axios
    this.api = axios.create({
      baseURL: 'http://10.15.32.11:8000', // URL base da API
      timeout: 10000, // Tempo limite para requisições
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache', // Configurações de cache
        'x-secret-key': 'sua_chave_secreta' // Outros headers que você precisa
      },
    });

    // Interceptores para tratar requisições e respostas
    this.api.interceptors.request.use(
      (config) => {
        // Adicione qualquer lógica antes da requisição ser enviada
        return config;
      },
      (error) => {
        // Trate o erro da requisição
        return Promise.reject(error);
      }
    );

    this.api.interceptors.response.use(
      (response) => {
        // Qualquer lógica para tratar a resposta
        return response;
      },
      (error) => {
        // Trate o erro da resposta
        return Promise.reject(error);
      }
    );
  }

  // Método para fazer uma requisição GET
  async get(endpoint, params = {}) {
    try {
      const response = await this.api.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer requisição GET:', error);
      throw error;
    }
  }

  // Método para fazer uma requisição POST
  async post(endpoint, data) {
    try {
      const response = await this.api.post(endpoint, data);
      //console.log(response);
      return response;
    } catch (error) {
      console.error('Erro ao fazer requisição POST:', error);
      throw error;
    }
  }

  // Método para fazer uma requisição PUT
  async put(endpoint, data) {
    try {
      const response = await this.api.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer requisição PUT:', error);
      throw error;
    }
  }

  // Método para fazer uma requisição PATCH
  async patch(endpoint, data) {
    try {
      const response = await this.api.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer requisição PATCH:', error);
      throw error;
    }
  }

  // Método para fazer uma requisição DELETE
  async delete(endpoint) {
    try {
      const response = await this.api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer requisição DELETE:', error);
      throw error;
    }
  }

  // Você pode adicionar mais métodos conforme necessário
}

// Exporta a classe ApiService
export default ApiService;