
import { Customer, Invoice, Order, StockItem, User, UserRole } from "../types";
import { POWER1_PRODUCTS_LIST, EXCLUDED_PRODUCTS_LIST } from "./constants";

// --- Mock Users ---
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    username: 'admin',
    password: '123', 
    name: 'Main Admin',
    salesExecutiveName: '', 
    role: UserRole.ADMIN,
    targetVolume: 10000,
    permissions: { viewStock: true, advancedSearch: true, viewUnbilled: true, manageData: true }
  },
  {
    id: 'u2',
    username: 'rahul',
    password: '123',
    name: 'Rahul Verma',
    salesExecutiveName: 'RAHUL VERMA', // Matches report
    role: UserRole.SALES,
    targetVolume: 2500,
    permissions: { viewStock: true, advancedSearch: false, viewUnbilled: true, manageData: false }
  },
  {
    id: 'u3',
    username: 'amit',
    password: '123',
    name: 'Amit Singh',
    salesExecutiveName: 'AMIT SINGH',
    role: UserRole.SALES,
    targetVolume: 3000,
    permissions: { viewStock: false, advancedSearch: false, viewUnbilled: false, manageData: false }
  }
];

const SALES_EXECS = ['RAHUL VERMA', 'AMIT SINGH', 'SURESH PATEL', 'VIKRAM RATHORE'];

// --- Mock Customers ---
export const MOCK_CUSTOMERS: Customer[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `c${i}`,
  name: `Auto Spares ${i + 1}`,
  location: i % 2 === 0 ? 'Mumbai Central' : 'Navi Mumbai',
  phone: `98765432${i.toString().padStart(2, '0')}`,
  type: i % 3 === 0 ? 'Workshop' : 'Retailer',
  totalVolumeYTD: Math.floor(Math.random() * 500),
  lastBilledDate: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
  salesExecutive: SALES_EXECS[i % SALES_EXECS.length]
}));

// --- Mock Products matching Logic ---
// We map specific brands and names to match services/constants.ts rules
const PRODUCTS = [
  { name: 'CASTROL ACTIV 4T 20W-40 1L', brand: 'CASTROL ACTIV', pack: 1, cat: 'Activ' },
  { name: 'CASTROL ACTIV 4T 900ML', brand: 'CASTROL ACTIV', pack: 0.9, cat: 'Activ' },
  { name: 'CASTROL ACTIV ESSENTIAL 1L', brand: 'CASTROL ACTIV ESSENTIAL', pack: 1, cat: 'Activ' }, // Should be excluded from Activ count
  
  // Power1 Items (Exact matches)
  { name: POWER1_PRODUCTS_LIST[0], brand: 'CASTROL POWER1', pack: 9, cat: 'Power1' }, // 10x0.9L = 9L pack for sim
  { name: POWER1_PRODUCTS_LIST[1], brand: 'CASTROL POWER1', pack: 10, cat: 'Power1' }, // 10x1L = 10L
  
  { name: 'CASTROL MAGNATEC 5W-30 SUV 3.5L', brand: 'CASTROL MAGNATEC', pack: 3.5, cat: 'Magnatec' },
  { name: 'CASTROL MAGNATEC DIESEL 15W-40', brand: 'CASTROL MAGNATEC DIESEL', pack: 5, cat: 'Magnatec' },
  
  { name: 'CASTROL CRB TURBOMAX 15W-40 7.5L', brand: 'CASTROL CRB TURBOMAX', pack: 7.5, cat: 'CRB' },
  
  // Autocare
  { name: 'AUTO CARE SHAMPOO', brand: 'AUTO CARE MAINTENANCE', pack: 0.5, cat: 'Other' },
  
  // Excluded Non-Core
  { name: EXCLUDED_PRODUCTS_LIST[0], brand: 'ACCESSORIES', pack: 0.2, cat: 'Other' },
];

export const MOCK_STOCK: StockItem[] = PRODUCTS.map((p, i) => ({
  id: `s${i}`,
  sku: `SKU-${1000+i}`,
  name: p.name,
  category: p.cat as any,
  packSize: p.pack,
  quantityBoxes: Math.floor(Math.random() * 200),
  unitsPerBox: 12
}));

// --- Mock Invoices (Concentrated in Current Month) ---
export const MOCK_INVOICES: Invoice[] = Array.from({ length: 300 }).map((_, i) => {
  const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const qty = Math.floor(Math.random() * 5) + 1; // 1 to 5 units
  const liters = qty * prod.pack;
  const price = 400 * liters;
  const customer = MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)];
  
  // Date Logic: Mostly current month, some previous
  const now = new Date();
  const isCurrentMonth = Math.random() > 0.2; // 80% data in current month
  let date;
  if (isCurrentMonth) {
      date = new Date(now.getFullYear(), now.getMonth(), Math.floor(Math.random() * now.getDate()) + 1);
  } else {
      date = new Date(now.getFullYear(), now.getMonth() - 1, Math.floor(Math.random() * 28) + 1);
  }

  return {
    id: `inv${i}`,
    invoiceNo: `INV-24-${10000 + i}`,
    date: date.toISOString().split('T')[0],
    customerId: customer.id,
    customerName: customer.name,
    salesExecutiveName: customer.salesExecutive || 'Unknown',
    totalAmount: price,
    totalLiters: liters,
    items: [{
      itemId: `s${i % PRODUCTS.length}`,
      itemName: prod.name,
      brand: prod.brand,
      quantity: qty,
      liters: liters,
      price: price
    }]
  };
});

// --- Mock Open Orders (Last 3 Days) ---
export const MOCK_ORDERS: Order[] = Array.from({ length: 20 }).map((_, i) => {
  const prod = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
  const daysAgo = Math.floor(Math.random() * 3);
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);

  return {
    id: `ord${i}`,
    date: date.toISOString().split('T')[0],
    customerId: MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)].id,
    customerName: MOCK_CUSTOMERS[Math.floor(Math.random() * MOCK_CUSTOMERS.length)].name,
    itemName: prod.name,
    quantity: Math.floor(Math.random() * 5) + 1,
    status: 'Open'
  };
});
