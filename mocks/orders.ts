import type { CheckoutInput } from "@/types/checkout";

// Mock database para simular persistência de pedidos
// Em produção, isso seria substituído por uma consulta real ao banco de dados
const ordersDatabase = new Map<string, {
  id: string;
  formData: CheckoutInput;
  createdAt: Date;
  status: "confirmed" | "processing" | "completed";
}>();

// Para desenvolvimento, vamos simular alguns pedidos comuns
const commonOrders = [
  {
    id: "CKT-1757968838221-2UE6BJFII",
    formData: {
      email: "lucas.silvestre@gmail.com",
      cpf: "07822816489",
      paymentMethod: "pix" as const,
      installments: 1,
    },
    createdAt: new Date(),
    status: "confirmed" as const,
  },
  {
    id: "CKT-1757968406214-FDTYQ2AKR", 
    formData: {
      email: "cliente@exemplo.com",
      cpf: "12345678901",
      paymentMethod: "pix" as const,
      installments: 1,
    },
    createdAt: new Date(),
    status: "confirmed" as const,
  },
  {
    id: "CKT-1757969000000-EXEMPLO123",
    formData: {
      email: "teste@exemplo.com",
      cpf: "11122233344",
      paymentMethod: "card" as const,
      installments: 3,
    },
    createdAt: new Date(),
    status: "confirmed" as const,
  },
];

// Inicializar com pedidos comuns para desenvolvimento
commonOrders.forEach(order => {
  ordersDatabase.set(order.id, order);
});

export function saveOrder(orderId: string, formData: CheckoutInput) {
  ordersDatabase.set(orderId, {
    id: orderId,
    formData,
    createdAt: new Date(),
    status: "confirmed",
  });
}

export function getOrderById(orderId: string) {
  return ordersDatabase.get(orderId) || null;
}

export function getAllOrders() {
  return Array.from(ordersDatabase.values());
}

// Função para validar se um orderId existe
export function orderExists(orderId: string): boolean {
  return ordersDatabase.has(orderId);
}

// Função para obter estatísticas dos pedidos
export function getOrderStats() {
  const orders = Array.from(ordersDatabase.values());
  return {
    total: orders.length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };
}

