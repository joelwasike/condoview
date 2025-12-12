// Mock data generators for demo mode

export const generateMockOverviewData = (role: string) => {
  const baseData = {
    totalProperties: Math.floor(Math.random() * 50) + 20,
    totalUsers: Math.floor(Math.random() * 100) + 50,
    totalPayments: Math.floor(Math.random() * 200) + 100,
    totalCollections: Math.floor(Math.random() * 50000) + 20000,
    totalExpenses: Math.floor(Math.random() * 30000) + 10000,
    netBalance: Math.floor(Math.random() * 20000) + 10000,
  };

  switch (role) {
    case 'agency_director':
      return {
        ...baseData,
        totalProperties: 45,
        totalUsers: 120,
        propertiesForSale: 15,
        propertiesForRent: 30,
      };
    
    case 'salesmanager':
      return {
        totalOccupancy: 85,
        totalClients: 65,
        pendingAlerts: 8,
      };
    
    case 'commercial':
      return {
        totalListings: 32,
        totalVisits: 48,
        pendingRequests: 12,
      };
    
    case 'admin':
      return {
        inboxCount: 24,
        documentsCount: 156,
        debtsCount: 18,
      };
    
    case 'accounting':
      return {
        totalCollections: 125000,
        totalExpenses: 45000,
        netBalance: 80000,
      };
    
    case 'technician':
      return {
        totalInspections: 28,
        totalTasks: 15,
        pendingRequests: 5,
      };
    
    case 'landlord':
      return {
        totalProperties: 12,
        totalTenants: 18,
        totalPayments: 45,
      };
    
    case 'tenant':
      return {
        totalPayments: 12,
        pendingMaintenance: 2,
        hasActiveLease: true,
      };
    
    case 'superadmin':
      return {
        totalCompanies: 25,
        totalSubscriptions: 48,
        activeSubscriptions: 42,
      };
    
    default:
      return baseData;
  }
};

export const generateMockListData = (count: number = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    status: ['Active', 'Pending', 'Completed'][Math.floor(Math.random() * 3)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// Generate mock property listings
export const generateMockListings = (count: number = 15) => {
  const types = ['Apartment', 'House', 'Villa', 'Studio', 'Penthouse'];
  const statuses = ['Available', 'Rented', 'For Sale', 'Under Contract'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `${types[Math.floor(Math.random() * types.length)]} ${i + 1}`,
    address: `${Math.floor(Math.random() * 999) + 1} ${['Main St', 'Oak Ave', 'Park Blvd', 'River Rd', 'Hill St'][Math.floor(Math.random() * 5)]}`,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    price: Math.floor(Math.random() * 5000) + 500,
    bedrooms: Math.floor(Math.random() * 4) + 1,
    bathrooms: Math.floor(Math.random() * 3) + 1,
    area: Math.floor(Math.random() * 200) + 50,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// Generate mock clients/tenants
export const generateMockClients = (count: number = 20) => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    email: `client${i + 1}@example.com`,
    phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
    status: ['Active', 'Pending', 'Inactive'][Math.floor(Math.random() * 3)],
    propertyCount: Math.floor(Math.random() * 5),
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// Generate mock visits
export const generateMockVisits = (count: number = 12) => {
  const statuses = ['Scheduled', 'Completed', 'Cancelled', 'Pending'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    propertyId: Math.floor(Math.random() * 10) + 1,
    propertyAddress: `${Math.floor(Math.random() * 999) + 1} Main St`,
    clientName: `Client ${i + 1}`,
    scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: i % 3 === 0 ? 'Interested in viewing' : null,
  }));
};

// Generate mock requests
export const generateMockRequests = (count: number = 10) => {
  const types = ['Visit Request', 'Information Request', 'Viewing Request'];
  const statuses = ['Pending', 'Approved', 'Rejected'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    clientName: `Client ${i + 1}`,
    propertyId: Math.floor(Math.random() * 10) + 1,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    requestedDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    message: 'Interested in this property',
  }));
};

// Generate mock payments
export const generateMockPayments = (count: number = 25) => {
  const types = ['Rent', 'Deposit', 'Fee', 'Maintenance'];
  const statuses = ['Paid', 'Pending', 'Overdue'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    tenantName: `Tenant ${i + 1}`,
    propertyId: Math.floor(Math.random() * 10) + 1,
    type: types[Math.floor(Math.random() * types.length)],
    amount: Math.floor(Math.random() * 3000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    paidDate: i % 2 === 0 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : null,
  }));
};

// Generate mock alerts
export const generateMockAlerts = (count: number = 8) => {
  const types = ['Payment Overdue', 'Maintenance Required', 'Lease Expiring', 'Document Missing'];
  const priorities = ['High', 'Medium', 'Low'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    propertyId: Math.floor(Math.random() * 10) + 1,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    message: `Alert ${i + 1}: Action required`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    resolved: i % 3 === 0,
  }));
};

// Generate mock documents
export const generateMockDocuments = (count: number = 15) => {
  const types = ['Contract', 'Invoice', 'Receipt', 'Lease', 'KYC Document'];
  const statuses = ['Approved', 'Pending', 'Rejected'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `${types[Math.floor(Math.random() * types.length)]}_${i + 1}.pdf`,
    type: types[Math.floor(Math.random() * types.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    uploadedDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    size: `${Math.floor(Math.random() * 5000) + 100} KB`,
  }));
};

// Generate mock expenses
export const generateMockExpenses = (count: number = 20) => {
  const categories = ['Maintenance', 'Utilities', 'Insurance', 'Taxes', 'Repairs'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    description: `${categories[Math.floor(Math.random() * categories.length)]} Expense ${i + 1}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    amount: Math.floor(Math.random() * 2000) + 100,
    propertyId: Math.floor(Math.random() * 10) + 1,
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['Paid', 'Pending'][Math.floor(Math.random() * 2)],
  }));
};

// Generate mock tasks
export const generateMockTasks = (count: number = 12) => {
  const statuses = ['Pending', 'In Progress', 'Completed'];
  const priorities = ['High', 'Medium', 'Low'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Task ${i + 1}`,
    description: `Task description ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    assignedTo: `Technician ${Math.floor(Math.random() * 5) + 1}`,
    dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedHours: Math.floor(Math.random() * 8) + 1,
  }));
};

// Generate mock inspections
export const generateMockInspections = (count: number = 10) => {
  const types = ['Move-in', 'Move-out', 'Routine', 'Maintenance'];
  const statuses = ['Scheduled', 'Completed', 'Pending'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    propertyId: Math.floor(Math.random() * 10) + 1,
    tenantName: `Tenant ${i + 1}`,
    scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    notes: i % 2 === 0 ? 'Inspection notes' : null,
  }));
};

// Generate mock debts
export const generateMockDebts = (count: number = 15) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    tenantName: `Tenant ${i + 1}`,
    propertyId: Math.floor(Math.random() * 10) + 1,
    amount: Math.floor(Math.random() * 2000) + 200,
    dueDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['Unpaid', 'Partially Paid', 'Paid'][Math.floor(Math.random() * 3)],
    description: `Debt for ${['Rent', 'Utilities', 'Fees'][Math.floor(Math.random() * 3)]}`,
  }));
};

// Generate mock leases
export const generateMockLeases = (count: number = 12) => {
  const statuses = ['Active', 'Expired', 'Pending', 'Terminated'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    tenantName: `Tenant ${i + 1}`,
    propertyId: Math.floor(Math.random() * 10) + 1,
    startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    monthlyRent: Math.floor(Math.random() * 3000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
};

// Generate mock reminders
export const generateMockReminders = (count: number = 10) => {
  const types = ['Payment Due', 'Lease Renewal', 'Inspection', 'Maintenance'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    title: `Reminder ${i + 1}`,
    description: `Reminder description ${i + 1}`,
    dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    completed: i % 3 === 0,
  }));
};

// Generate mock utilities
export const generateMockUtilities = (count: number = 8) => {
  const types = ['CIE Transfer', 'SODECI Transfer', 'Document Processing'];
  const statuses = ['Pending', 'Completed', 'In Progress'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    propertyId: Math.floor(Math.random() * 10) + 1,
    tenantName: `Tenant ${i + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    requestedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

// Generate mock collections
export const generateMockCollections = (count: number = 20) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    tenantName: `Tenant ${i + 1}`,
    buildingId: Math.floor(Math.random() * 5) + 1,
    landlordId: Math.floor(Math.random() * 3) + 1,
    chargeType: ['Rent', 'Utilities', 'Fees'][Math.floor(Math.random() * 3)],
    amount: Math.floor(Math.random() * 2000) + 500,
    collectedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: ['Collected', 'Pending'][Math.floor(Math.random() * 2)],
  }));
};

// Generate mock transactions
export const generateMockTransactions = (count: number = 30) => {
  const types = ['Subscription', 'Payment', 'Refund'];
  const statuses = ['Completed', 'Pending', 'Failed'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    companyName: `Company ${Math.floor(Math.random() * 10) + 1}`,
    amount: Math.floor(Math.random() * 10000) + 1000,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
  }));
};

// Generate mock inbox items
export const generateMockInbox = (count: number = 15) => {
  const types = ['Email', 'Document', 'Request', 'Notification'];
  const statuses = ['Unread', 'Read', 'Archived'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    type: types[Math.floor(Math.random() * types.length)],
    subject: `Inbox Item ${i + 1}`,
    from: `sender${i + 1}@example.com`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    priority: i % 4 === 0 ? 'High' : 'Normal',
  }));
};
