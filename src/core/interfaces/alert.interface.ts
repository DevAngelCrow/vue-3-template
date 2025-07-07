export interface alert {
    show?: boolean;
    type?: "success" | "success" | "info" | "warning" | "error";
    icon?: string;
    title?: string;
    content?: string;
    closable?: boolean;
    maxWith?: number;
    timeout?: number;
}