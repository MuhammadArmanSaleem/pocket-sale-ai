export type Locale = "en" | "ur";
export type Direction = "ltr" | "rtl";
export type Role = "owner" | "admin";
export type Page =
  | "overview"
  | "catalogue"
  | "sessions"
  | "orders"
  | "followups"
  | "support"
  | "owners"
  | "settings";
export type Stage = "login" | "setup" | "connection" | "workspace";
export interface Variant {
  id: string;
  size: string;
  colour: string;
  price: number;
  stock: number;
}
export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  visible: boolean;
  variants: Variant[];
  photos: string[];
}
export interface Shop {
  id: string;
  name: string;
  owner: string;
  email: string;
  connected: boolean;
}
export interface SupportMessage {
  id: string;
  sender: Role;
  text: string;
}
export interface Ticket {
  id: string;
  shopId: string;
  subject: string;
  status: "open" | "waiting" | "resolved";
  messages: SupportMessage[];
}
export interface Session {
  id: string;
  name: string;
  initials: string;
  intent: "product" | "delivery" | "order";
  mode: "ai" | "seller";
  messages: {
    id: string;
    text: string;
    sender: "customer" | "ai" | "seller";
  }[];
}
export interface NavigationItem {
  page: Page;
  icon:
    | "overview"
    | "catalogue"
    | "sessions"
    | "orders"
    | "followups"
    | "support"
    | "owners"
    | "settings";
}
export interface CatalogueProps {
  products: Product[];
  onChange: (p: Product[]) => void;
  notify: (s: string) => void;
}
export interface ProductEditorProps {
  product: Product | null;
  onCancel: () => void;
  onSave: (p: Product) => void;
}
export interface ImportDialogProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  onImport: (v: Product[]) => void;
}
export interface SupportProps {
  role: Role;
  shops: Shop[];
  tickets: Ticket[];
  setTickets: (v: Ticket[]) => void;
  notify: (s: string) => void;
}
export interface SessionsProps {
  sessions: Session[];
  setSessions: (v: Session[]) => void;
  notify: (s: string) => void;
}
export interface NavigationProps {
  items: NavigationItem[];
  current: Page;
  go: (v: Page) => void;
}
export interface AttentionProps {
  icon: import("react").ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
}
export interface HeadingProps {
  title: string;
  subtitle: string;
  action?: import("react").ReactNode;
}
export interface ChoiceProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { value: string; label: string }[];
}
export interface MoneyProps {
  value: number;
}
export type FieldProps = import("react").ComponentProps<
  typeof import("@/components/ui/input").Input
> & { label: string };
export interface RootLayoutProps {
  children: import("react").ReactNode;
}
