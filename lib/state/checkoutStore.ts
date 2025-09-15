import { create } from "zustand";

export type PaymentMethod = "pix" | "card";

interface CheckoutState {
  email: string;
  cpf: string;
  paymentMethod: PaymentMethod;
  installments: number;
  setEmail: (v: string) => void;
  setCpf: (v: string) => void;
  setPaymentMethod: (v: PaymentMethod) => void;
  setInstallments: (v: number) => void;
  hydrate: (data: Partial<Pick<CheckoutState, 'email' | 'cpf' | 'paymentMethod' | 'installments'>>) => void;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  email: "",
  cpf: "",
  paymentMethod: "pix",
  installments: 1,
  setEmail: (v) => set({ email: v }),
  setCpf: (v) => set({ cpf: v }),
  setPaymentMethod: (v) => set({ paymentMethod: v }),
  setInstallments: (v) => set({ installments: v }),
  hydrate: (data) => set(data),
}));

// seletores primitivos (evitam recriar objetos a cada render)
export const selEmail = (s: CheckoutState) => s.email;
export const selCpf = (s: CheckoutState) => s.cpf;
export const selPM = (s: CheckoutState) => s.paymentMethod;
export const selInst = (s: CheckoutState) => s.installments;
export const selSetters = (s: CheckoutState) => ({
  setEmail: s.setEmail,
  setCpf: s.setCpf,
  setPaymentMethod: s.setPaymentMethod,
  setInstallments: s.setInstallments,
});

// Seletores para obter dados completos do formulário
export const selFormData = (s: CheckoutState) => ({
  email: s.email,
  cpf: s.cpf,
  paymentMethod: s.paymentMethod,
  installments: s.installments,
});
