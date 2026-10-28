import {
  LayoutDashboard,
  Package,
  MessagesSquare,
  ClipboardList,
  ArrowUpRight,
  LifeBuoy,
  Users,
  Settings,
} from "lucide-react";
import type { NavigationItem, Product, Session, Shop, Ticket } from "./types";
export const languageOptions = [
  { value: "en", label: "English" },
  { value: "ur", label: "اردو" },
] as const;
export const ownerNavigation: NavigationItem[] = [
  { page: "overview", icon: "overview" },
  { page: "catalogue", icon: "catalogue" },
  { page: "sessions", icon: "sessions" },
  { page: "orders", icon: "orders" },
  { page: "followups", icon: "followups" },
  { page: "support", icon: "support" },
  { page: "settings", icon: "settings" },
];
export const adminNavigation: NavigationItem[] = [
  { page: "overview", icon: "overview" },
  { page: "owners", icon: "owners" },
  { page: "support", icon: "support" },
];
export const productFilters = ["all", "active", "hidden", "low"] as const;
export const ticketStatuses = ["open", "waiting", "resolved"] as const;
export const roleOptions = ["owner", "admin"] as const;
export const previewProducts: Product[] = [
  {
    id: "p1",
    name: "Everyday cotton shirt",
    category: "Shirts",
    description: "Soft cotton. Relaxed fit, made for everyday comfort.",
    visible: true,
    photos: [],
    variants: [
      { id: "v1", size: "M", colour: "Black", price: 1850, stock: 12 },
      { id: "v2", size: "L", colour: "Black", price: 1950, stock: 5 },
    ],
  },
  {
    id: "p2",
    name: "Classic linen kurta",
    category: "Kurtas",
    description: "A lightweight linen blend with a clean silhouette.",
    visible: true,
    photos: [],
    variants: [
      { id: "v3", size: "M", colour: "Sand", price: 3200, stock: 3 },
      { id: "v4", size: "L", colour: "Sand", price: 3200, stock: 0 },
    ],
  },
  {
    id: "p3",
    name: "Straight fit trousers",
    category: "Trousers",
    description: "A comfortable straight fit with everyday versatility.",
    visible: true,
    photos: [],
    variants: [
      { id: "v5", size: "32", colour: "Olive", price: 2400, stock: 18 },
    ],
  },
  {
    id: "p4",
    name: "Textured summer shirt",
    category: "Shirts",
    description: "Textured fabric from the upcoming summer collection.",
    visible: false,
    photos: [],
    variants: [{ id: "v6", size: "M", colour: "Cream", price: 2100, stock: 0 }],
  },
];
export const previewShops: Shop[] = [
  {
    id: "studio",
    name: "Studio Clothing",
    owner: "Ahmed Raza",
    email: "ahmed@example.com",
    connected: true,
  },
  {
    id: "noor",
    name: "Noor Boutique",
    owner: "Fatima Noor",
    email: "fatima@example.com",
    connected: false,
  },
  {
    id: "urban",
    name: "Urban Threads",
    owner: "Hassan Ali",
    email: "hassan@example.com",
    connected: true,
  },
];
export const previewTickets: Ticket[] = [
  {
    id: "102",
    shopId: "studio",
    subject: "How do I update sizes separately?",
    status: "open",
    messages: [
      {
        id: "m1",
        sender: "owner",
        text: "Can I set different stock for medium and large shirts?",
      },
    ],
  },
  {
    id: "101",
    shopId: "noor",
    subject: "Need help connecting WhatsApp",
    status: "waiting",
    messages: [
      {
        id: "m2",
        sender: "owner",
        text: "I cannot finish connecting my business number. Please help.",
      },
    ],
  },
  {
    id: "100",
    shopId: "urban",
    subject: "Delivery information",
    status: "resolved",
    messages: [
      {
        id: "m3",
        sender: "owner",
        text: "Where do I update my delivery policy?",
      },
      {
        id: "m4",
        sender: "admin",
        text: "Open Catalogue, then Shop policies.",
      },
    ],
  },
];
export const previewSessions: Session[] = [
  {
    id: "s1",
    name: "Ayesha Khan",
    initials: "AK",
    intent: "product",
    mode: "ai",
    messages: [
      {
        id: "a1",
        sender: "customer",
        text: "Assalamualaikum! Black shirt large mein available hai?",
      },
      {
        id: "a2",
        sender: "ai",
        text: "Walaikum assalam! Black / Large available hai. Price Rs 1,950 hai.",
      },
    ],
  },
  {
    id: "s2",
    name: "Hamza Ahmed",
    initials: "HA",
    intent: "delivery",
    mode: "seller",
    messages: [
      {
        id: "h1",
        sender: "customer",
        text: "Kal tak delivery ho sakti hai? Mujhe urgent chahiye.",
      },
    ],
  },
  {
    id: "s3",
    name: "Sara Ali",
    initials: "SA",
    intent: "order",
    mode: "ai",
    messages: [
      {
        id: "s31",
        sender: "customer",
        text: "Ji, ek black shirt order karni hai.",
      },
    ],
  },
];
export const previewOrders = [
  {
    id: "DR-1042",
    name: "Sara Ali",
    product: "Everyday cotton shirt · Black / L",
    price: 1950,
  },
  {
    id: "DR-1041",
    name: "Bilal Raza",
    product: "Straight fit trousers · Olive / 32",
    price: 2400,
  },
];
export const metricKeys = [
  "conversations",
  "aiHandling",
  "draftOrders",
  "activeProducts",
] as const;
export const adminMetricKeys = [
  "shops",
  "connectedShops",
  "openQueries",
  "resolvedQueries",
] as const;
export const activityBars = [
  { day: "mon", count: 8 },
  { day: "tue", count: 14 },
  { day: "wed", count: 11 },
  { day: "thu", count: 20 },
  { day: "fri", count: 17 },
  { day: "sat", count: 26 },
  { day: "sun", count: 32 },
] as const;
export const newVariant = { size: "", colour: "", price: 0, stock: 0 };

export const navigationIcons = {
  overview: LayoutDashboard,
  catalogue: Package,
  sessions: MessagesSquare,
  orders: ClipboardList,
  followups: ArrowUpRight,
  support: LifeBuoy,
  owners: Users,
  settings: Settings,
};
