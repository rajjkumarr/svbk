"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/common/Modal";
// import TenantCard from "./TenantCard";
import { Tenant } from "@/features/tenants/tenantData";
import { getTenants, saveTenant } from "@/features/tenants/services/tenants.service";
import { getStorageItem } from "@/storage";
import { TenantCard } from "@/components/common/TenantCard/TenantCard";
import { TenantCardContent, TenantCardField, TenantCardHeader } from "@/components/common";


function TenantManagement() {
  const router = useRouter();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("All");
  const [filterState, setFilterState] = useState("All");
  const [selectedId, setSelectedId] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const data = getStorageItem("userDetails")

  const [formData, setFormData] = useState<Omit<Tenant, "id">>({
    schoolName: "",
    schoolCode: "",
    tenantCode: "",
    tenantName: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof Omit<Tenant, "id">, string>>>({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getTenants()
      .then((data) => {
        if (cancelled) return;
        setTenants(data);
        setSelectedId(data[0]?.id ?? "");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
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
      tenantName: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });
    setFormErrors({});
    setSaveError("");
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

  const onSaveTenant = async () => {
    if (!validate()) return;

    setSaving(true);
    setSaveError("");

    try {
      const newTenant = await saveTenant(formData);

      // Re-fetch the full list from the server so local state is in sync
      const refreshed = await getTenants();
      setTenants(refreshed);
      setDrawerOpen(false);
      setSelectedId(newTenant.id);
      resetForm();
      setPage(1);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Failed to save tenant. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const onOpenDrawer = () => {
    resetForm();
    setDrawerOpen(true);
    setFormErrors({});
  };

  const onCardSelect = (id: string) => {
    setSelectedId(id);
    router.push(`/tenants/${id}`);
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
                // tenant={tenant}
                isSelected={selectedId === tenant.id}
                onClick={() => onCardSelect(tenant.id)}
              >
                <TenantCardHeader
                  title={tenant.schoolName}
                  subtitle={tenant.tenantName}
                  showCheckmark={selectedId === tenant.id}
                />
                <TenantCardContent>
                  <TenantCardField label="School Code" value={tenant.schoolCode} size="sm" />
                  <TenantCardField label="Tenant Code" value={tenant.tenantCode} size="sm" />
                  <TenantCardField label="Location" value={`${tenant.city}, ${tenant.state}`} size="sm" />
                </TenantCardContent>

              </TenantCard>
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
                value={formData.tenantName}
                onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                error={formErrors.tenantName}
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
            {saveError && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{saveError}</p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => setDrawerOpen(false)}
                disabled={saving}
                fullWidth
                className="sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={onSaveTenant}
                isLoading={saving}
                disabled={saving}
                fullWidth
                className="sm:w-auto"
              >
                {saving ? "Saving..." : "Save Tenant"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TenantManagement;
