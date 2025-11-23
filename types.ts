
// Data Models

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES = 'SALES',
}

export interface Permission {
  viewStock: boolean;
  advancedSearch: boolean;
  viewUnbilled: boolean;
  manageData: boolean; // New permission for uploading files
}

export interface User {
  id: string;
  username: string;
  password?: string;
  name: string; // Display Name
  salesExecutiveName?: string; // The exact name used in Excel reports (e.g., "Rahul V")
  role: UserRole;
  targetVolume: number; // in Liters
  permissions: Permission;
}

export interface SystemConfig {
  companyName: string;
  logoUrl: string;
  maintenanceMode: boolean;
}

export interface Customer {
  id: string;
  name: string;
  location: string;
  phone: string;
  type: 'Retailer' | 'Workshop' | 'Distributor';
  totalVolumeYTD: number;
  lastBilledDate: string;
  salesExecutive?: string; // Linked SE
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: 'Activ' | 'Power1' | 'Magnatec' | 'CRB' | 'Other';
  packSize: number; // Liters per unit
  quantityBoxes: number; // Box count
  unitsPerBox: number;
}

export interface InvoiceItem {
  itemId: string;
  itemName: string; // Product Name
  brand: string; // Brand Name (e.g., CASTROL ACTIV)
  quantity: number;
  liters: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  date: string;
  customerId: string;
  customerName: string;
  salesExecutiveName: string; // Added for SE reports
  items: InvoiceItem[];
  totalAmount: number;
  totalLiters: number;
}

export interface Order {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  itemName: string;
  quantity: number; // Cases/Units
  status: 'Open' | 'Pending' | 'Processed';
}

// Filter Types for Dashboard matching Legacy logic
export type DashboardReportType = 
  'VOLUME_BY_EXEC' | 
  'WEEKLY_SALES' | 
  'ACTIV_COUNT' | 
  'POWER1_COUNT' | 
  'MAGNATEC_COUNT' | 
  'CRB_COUNT' | 
  'HIGH_VOL_COUNT' | 
  'AUTOCARE_COUNT' |
  'VOL_BY_BRAND' |
  'TOP_CUSTOMERS';
