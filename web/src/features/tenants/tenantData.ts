export type Tenant = {
  id: string;
  schoolName: string;
  schoolCode: string;
  tenantCode: string;
  tenantName: string;
  address: string;
  city: string;
  state: string;
  country: string;
};

export const initialTenants: Tenant[] = [
  {
    id: "t1",
    schoolName: "Sunrise High School",
    schoolCode: "SHS001",
    tenantCode: "TNT001",
    tenantName: "Main Campus",
    address: "201 East Maple Street",
    city: "Springfield",
    state: "Illinois",
    country: "USA",
  },
  {
    id: "t2",
    schoolName: "Green Valley Academy",
    schoolCode: "GVA002",
    tenantCode: "TNT002",
    tenantName: "North Campus",
    address: "88 Oak Avenue",
    city: "Franklin",
    state: "Tennessee",
    country: "USA",
  },
  {
    id: "t3",
    schoolName: "Riverstone School",
    schoolCode: "RS003",
    tenantCode: "TNT003",
    tenantName: "River Campus",
    address: "456 Riverbend Drive",
    city: "Madison",
    state: "Wisconsin",
    country: "USA",
  },
  {
    id: "t4",
    schoolName: "Everest International",
    schoolCode: "EI004",
    tenantCode: "TNT004",
    tenantName: "International Campus",
    address: "121 Summit Road",
    city: "Denver",
    state: "Colorado",
    country: "USA",
  },
  {
    id: "t5",
    schoolName: "Pinecrest Institute",
    schoolCode: "PI005",
    tenantCode: "TNT005",
    tenantName: "Pine Campus",
    address: "777 Redwood Street",
    city: "Portland",
    state: "Oregon",
    country: "USA",
  },
];

export function findTenantById(id: string) {
  return initialTenants.find((tenant) => tenant.id === id) ?? null;
}
