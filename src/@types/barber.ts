
export type Barber = {
  id: number,             // Identificador único do barbeiro (autoincrementado)
  name: string,           // Nome do barbeiro
  email?: string,         // E-mail do barbeiro (opcional)
  imageUrl?: string,      // URL da imagem do barbeiro (opcional)
  barberShopId?: string,  // ID da barbearia onde o barbeiro trabalha (opcional, pois pode haver barbeiros sem barbearia)
}
