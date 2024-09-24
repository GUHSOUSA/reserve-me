export type Client = {
  id: string;               // ID do cliente (geralmente um UUID)
  name?: string;            // Nome do cliente, opcional
  phoneNumber: string;      // Número de telefone do cliente, obrigatório
};
