export interface ToastParameters {
  permanent?: boolean;
  title: string;
  description: string;
}

export interface Toast extends ToastParameters {
  expiresAt: Date | null;
}
