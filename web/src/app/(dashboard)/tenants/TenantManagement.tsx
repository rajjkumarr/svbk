"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from  "@/components/common/Modal";
import TenantCard from "./TenantCard";

type Tenant = {
  id: string;
  schoolName: string;
  schoolCode: string;
  tenantCode: string;
  campusName: string;
  address: string;
  city: string;
  state: string;
  country: string;
};

const initialTenants: Tenant[] = [
  {
    id: "t1",
    schoolName: "Sunrise High School",
    schoolCode: "SHS001",
    tenantCode: "TNT001",
    campusName: "Main Campus",
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
    campusName: "North Campus",
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
    campusName: "River Campus",
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
    campusName: "International Campus",
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
    campusName: "Pine Campus",
    address: "777 Redwood Street",
    city: "Portland",
    state: "Oregon",
    country: "USA",
  },
];

const generateUniqueId = () => `t${Date.now()}${Math.floor(Math.random() * 1000)}`;


function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterState, setFilterState] = useState("All");
  const [selectedId, setSelectedId] = useState<string>(initialTenants[0]?.id ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const [formData, setFormData] = useState<Omit<Tenant, "id">>({
    schoolName: "",
    schoolCode: "",
    tenantCode: "",
    campusName: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Omit<Tenant, "id">, string>>>({});

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(timer);
  }, []);

  const cities = useMemo(() => ["All", ...Array.from(new Set(tenants.map((t) => t.city))).sort()], [tenants]);
  const states = useMemo(() => ["All", ...Array.from(new Set(tenants.map((t) => t.state))).sort()], [tenants]);

  const filteredTenants = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    return tenants.filter((tenant) => {
      const matchesSearch =
        normalized === "" ||
        tenant.schoolName.toLowerCase().includes(normalized) ||
        tenant.schoolCode.toLowerCase().includes(normalized) ||
        tenant.tenantCode.toLowerCase().includes(normalized) ||
        tenant.city.toLowerCase().includes(normalized);

      const matchesCity = filterCity === "All" || tenant.city === filterCity;
      const matchesState = filterState === "All" || tenant.state === filterState;

      return matchesSearch && matchesCity && matchesState;
    });
  }, [tenants, search, filterCity, filterState]);

  const totalPages = Math.max(1, Math.ceil(filteredTenants.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedTenants = filteredTenants.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetForm = () => {
    setFormData({
      schoolName: "",
      schoolCode: "",
      tenantCode: "",
      campusName: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });
    setFormErrors({});
  };

  const validate = () => {
    const errors: Partial<Record<keyof Omit<Tenant, "id">, string>> = {};

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      if (!formData[key].trim()) {
        errors[key] = "This field is required";
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSaveTenant = () => {
    if (!validate()) return;

    const newTenant: Tenant = {
      id: generateUniqueId(),
      ...formData,
    };

    setTenants((prev) => [newTenant, ...prev]);
    setDrawerOpen(false);
    setSelectedId(newTenant.id);
    resetForm();
    setPage(1);
  };

  const onOpenDrawer = () => {
    resetForm();
    setDrawerOpen(true);
    setFormErrors({});
  };

  const onCardSelect = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--app-text-primary)]">Tenant Management</h1>
          <p className="mt-1 text-sm text-[var(--app-text-secondary)]">Manage and switch between tenants</p>
        </div>
        <Button onClick={onOpenDrawer} size="md" variant="primary" className="min-w-[150px]">
          + Add Tenant
        </Button>
      </div>

      <Card className="mb-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input
            label="Search"
            placeholder="Search by school name, tenant code, or city..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            fullWidth
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">City</label>
            <select
              value={filterCity}
              onChange={(e) => {
                setFilterCity(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-lg border border-zinc-300 px-3 text-base focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">State</label>
            <select
              value={filterState}
              onChange={(e) => {
                setFilterState(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-lg border border-zinc-300 px-3 text-base focus:outline-none focus:ring-2 focus:ring-foreground/20"
            >
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800" />
          ))}
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
          <p className="text-xl font-semibold">No tenants found</p>
          <p className="mt-2">Try changing search or filter options, or add a new tenant.</p>
          <Button className="mt-4" onClick={onOpenDrawer} variant="primary">
            + Add Tenant
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <button
              type="button"
              onClick={onOpenDrawer}
              className="rounded-xl border-2 border-dashed border-zinc-300 bg-white p-5 text-left transition hover:border-foreground hover:bg-[var(--app-card-bg)]"
            >
              <div className="flex h-full flex-col justify-center gap-2 text-zinc-500">
                <span className="text-3xl font-bold">+</span>
                <span className="font-medium">New Tenant</span>
                <span className="text-sm">Add a new tenant configuration</span>
              </div>
            </button>

            {paginatedTenants.map((tenant) => (
              <TenantCard
                key={tenant.id}
                tenant={tenant}
                isSelected={selectedId === tenant.id}
                onClick={() => onCardSelect(tenant.id)}
              />
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--app-text-secondary)]">
              Showing {paginatedTenants.length} of {filteredTenants.length} tenant(s)
            </p>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="text-sm text-[var(--app-text-secondary)]">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Add Tenant"
        size="full"
      >
        <div className="mx-auto flex h-full max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-[var(--app-card-bg)]">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            <h2 className="mb-3 text-xl font-bold text-[var(--app-text-primary)]">Tenant details</h2>
            <p className="mb-5 text-sm text-[var(--app-text-secondary)]">
              Fill in the school and tenant information. Fields marked with * are required.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="School Name *"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                error={formErrors.schoolName}
                fullWidth
              />
              <Input
                label="School Code *"
                value={formData.schoolCode}
                onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value })}
                error={formErrors.schoolCode}
                fullWidth
              />
              <Input
                label="Tenant Code *"
                value={formData.tenantCode}
                onChange={(e) => setFormData({ ...formData, tenantCode: e.target.value })}
                error={formErrors.tenantCode}
                fullWidth
              />
              <Input
                label="Campus / Tenant Name *"
                value={formData.campusName}
                onChange={(e) => setFormData({ ...formData, campusName: e.target.value })}
                error={formErrors.campusName}
                fullWidth
              />
              <div className="sm:col-span-2">
                <Input
                  label="Address *"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  error={formErrors.address}
                  fullWidth
                />
              </div>
              <Input
                label="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                error={formErrors.city}
                fullWidth
              />
              <Input
                label="State *"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                error={formErrors.state}
                fullWidth
              />
              <Input
                label="Country *"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                error={formErrors.country}
                fullWidth
              />
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-zinc-200 bg-[var(--app-card-bg)] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setDrawerOpen(false);
                }}
                fullWidth
                className="sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={onSaveTenant}
                fullWidth
                className="sm:w-auto"
              >
                Save Tenant
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TenantManagement;
