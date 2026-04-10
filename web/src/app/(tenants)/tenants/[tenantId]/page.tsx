"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tenant } from "@/features/tenants/tenantData";
import { getTenantById } from "@/features/tenants/services/tenants.service";
import { Modal } from "@/components/common/Modal";
import TenantConfigurationTab from "./TenantConfigurationTab";
import TenantDetailsTab from "./TenantDetailsTab";
import TenantAdminsTab from "./TenantAdminsTab";

type NewConfig = {
  envType: string;
  configName: string;
  logoUrl: string;
  domainUrl: string;
  backendUrl: string;
  storageTab: "accessKeys" | "connectionString";
  accessKey: string;
  secretKey: string;
  bucketName: string;
  gatewayType: string;
  paymentKey: string;
  paymentSecret: string;
  webhookUrl: string;
};

const emptyConfig: NewConfig = {
  envType: "",
  configName: "",
  logoUrl: "",
  domainUrl: "",
  backendUrl: "",
  storageTab: "accessKeys",
  accessKey: "",
  secretKey: "",
  bucketName: "",
  gatewayType: "",
  paymentKey: "",
  paymentSecret: "",
  webhookUrl: "",
};

export default function TenantDetailsPage() {
  const { tenantId } = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"details" | "configuration" | "admins">("details");

  // Config modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newConfig, setNewConfig] = useState<NewConfig>(emptyConfig);
  const [newConfigErrors, setNewConfigErrors] = useState<Partial<Record<keyof NewConfig, string>>>({});
  const [showSecret, setShowSecret] = useState(false);
  const [modalSuccess, setModalSuccess] = useState("");

  // Add Admin modal state
  type NewAdmin = {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    role: string;
    branch: string;
  };
  const emptyAdmin: NewAdmin = { firstName: "", lastName: "", email: "", mobile: "", role: "", branch: "" };
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState<NewAdmin>(emptyAdmin);
  const [adminErrors, setAdminErrors] = useState<Partial<Record<keyof NewAdmin, string>>>({});
  const [adminSuccess, setAdminSuccess] = useState("");

  const updateAdmin = (updates: Partial<NewAdmin>) =>
    setNewAdmin((prev) => ({ ...prev, ...updates }));

  const onAdminSubmit = () => {
    const errs: Partial<Record<keyof NewAdmin, string>> = {};
    (Object.keys(emptyAdmin) as (keyof NewAdmin)[]).forEach((key) => {
      if (!newAdmin[key].trim()) errs[key] = "This field is required";
      if (key === "email" && newAdmin.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdmin.email))
        errs.email = "Enter a valid email address";
    });
    setAdminErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setAdminSuccess("Admin added successfully!");
    window.setTimeout(() => {
      setAdminSuccess("");
      setAdminModalOpen(false);
      setNewAdmin(emptyAdmin);
      setAdminErrors({});
    }, 1500);
  };

  const onAdminModalClose = () => {
    setAdminModalOpen(false);
    setNewAdmin(emptyAdmin);
    setAdminErrors({});
    setAdminSuccess("");
  };

  useEffect(() => {
    if (!tenantId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    getTenantById(String(tenantId))
      .then((data) => {
        if (cancelled) return;
        setTenant(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Tenant not found");
        setTenant(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [tenantId]);

  const visibleTenant = useMemo(() => tenant, [tenant]);

  const updateNew = (updates: Partial<NewConfig>) =>
    setNewConfig((prev) => ({ ...prev, ...updates }));

  const validateField = (field: keyof NewConfig, value: string) => {
    if (!value.trim()) return "This field is required";
    if (["logoUrl", "domainUrl", "backendUrl", "webhookUrl"].includes(field)) {
      if (!/^https?:\/\//.test(value.trim())) return "Enter a valid URL";
    }
    return "";
  };

  const onModalSubmit = () => {
    const requiredFields: (keyof NewConfig)[] = [
      "envType", "configName", "logoUrl", "domainUrl", "backendUrl",
      "accessKey", "secretKey", "bucketName", "paymentKey", "paymentSecret", "webhookUrl",
    ];
    const errs: Partial<Record<keyof NewConfig, string>> = {};
    requiredFields.forEach((key) => {
      const error = validateField(key, newConfig[key] as string);
      if (error) errs[key] = error;
    });
    setNewConfigErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setModalSuccess("Configuration added successfully!");
    window.setTimeout(() => {
      setModalSuccess("");
      setModalOpen(false);
      setNewConfig(emptyConfig);
      setNewConfigErrors({});
    }, 1500);
  };

  const onModalClose = () => {
    setModalOpen(false);
    setNewConfig(emptyConfig);
    setNewConfigErrors({});
    setModalSuccess("");
    setShowSecret(false);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="h-8 w-1/3 animate-pulse rounded-md bg-zinc-200" />
          <div className="h-6 w-1/2 animate-pulse rounded-md bg-zinc-200" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-32 animate-pulse rounded-xl bg-zinc-200" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !visibleTenant) {
    return (
      <div className="p-4 sm:p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="text-xl font-semibold text-red-700">Tenant not found</h2>
          <p className="mt-2 text-sm text-red-600">Please go back and select another tenant.</p>
          <Button onClick={() => router.push("/tenants")} className="mt-4" variant="secondary">
            Back to list
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {/* Header row: back icon + school name on left, action button on right */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/tenants")}
            aria-label="Go back"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 bg-transparent text-[var(--app-text-secondary)] transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text-primary)]">
              {visibleTenant.schoolName}
            </h1>
            <p className="text-sm text-[var(--app-text-secondary)]">
              {visibleTenant.tenantCode} • {visibleTenant.tenantName}
            </p>
          </div>
        </div>

        {activeTab === "configuration" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Configuration
          </Button>
        )}
        {activeTab === "admins" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAdminModalOpen(true)}
            className="flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Admin
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-nowrap gap-2 overflow-x-auto border-b border-zinc-200 pb-2">
        {[
          { id: "details", label: "Details" },
          { id: "configuration", label: "Configuration" },
          { id: "admins", label: "Admins" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "details" | "configuration" | "admins")}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "bg-[var(--app-card-bg)] text-foreground"
                : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === "details" && <TenantDetailsTab tenant={visibleTenant} />}
        {activeTab === "configuration" && <TenantConfigurationTab />}
        {activeTab === "admins" && <TenantAdminsTab />}
      </div>

      {/* Add Configuration Modal */}
      <Modal
        open={modalOpen}
        onClose={onModalClose}
        title="Add Configuration"
        size="2xl"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={onModalClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onModalSubmit}>
              Save Configuration
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* General */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-secondary)]">
              General
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Environment Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newConfig.envType}
                  onChange={(e) => updateNew({ envType: e.target.value })}
                  className={`h-11 rounded-lg border px-3 text-base bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground ${
                    newConfigErrors.envType
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-zinc-300 dark:border-zinc-600"
                  }`}
                >
                  <option value="">Select environment</option>
                  <option value="Production">Production</option>
                  <option value="QA">QA</option>
                  <option value="Development">Development</option>
                </select>
                {newConfigErrors.envType && (
                  <p className="text-sm text-red-600">{newConfigErrors.envType}</p>
                )}
              </div>
              <Input
                label="Configuration Name *"
                placeholder="e.g. Production Config"
                value={newConfig.configName}
                onChange={(e) => updateNew({ configName: e.target.value })}
                error={newConfigErrors.configName}
                fullWidth
              />
            </div>
          </fieldset>

          <div className="border-t border-[var(--app-divider)]" />

          {/* Domain Settings */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-secondary)]">
              Domain Settings
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Logo URL *"
                placeholder="https://example.com/logo.png"
                value={newConfig.logoUrl}
                onChange={(e) => updateNew({ logoUrl: e.target.value })}
                error={newConfigErrors.logoUrl}
                fullWidth
              />
              <Input
                label="Domain URL *"
                placeholder="https://app.example.com"
                value={newConfig.domainUrl}
                onChange={(e) => updateNew({ domainUrl: e.target.value })}
                error={newConfigErrors.domainUrl}
                fullWidth
              />
              <Input
                label="Backend API URL *"
                placeholder="https://api.example.com"
                value={newConfig.backendUrl}
                onChange={(e) => updateNew({ backendUrl: e.target.value })}
                error={newConfigErrors.backendUrl}
                fullWidth
                className="sm:col-span-2"
              />
            </div>
          </fieldset>

          <div className="border-t border-[var(--app-divider)]" />

          {/* File Storage */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-secondary)]">
              File Storage
            </legend>
            <div className="flex gap-2">
              {(["accessKeys", "connectionString"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => updateNew({ storageTab: tab })}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                    newConfig.storageTab === tab
                      ? "bg-foreground text-background"
                      : "border border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800"
                  }`}
                >
                  {tab === "accessKeys" ? "Access Keys" : "Connection String"}
                </button>
              ))}
            </div>

            {newConfig.storageTab === "accessKeys" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Client ID / Access Key *"
                  placeholder="Enter access key"
                  value={newConfig.accessKey}
                  onChange={(e) => updateNew({ accessKey: e.target.value })}
                  error={newConfigErrors.accessKey}
                  fullWidth
                />
                <div className="relative">
                  <Input
                    label="Secret Key *"
                    type={showSecret ? "text" : "password"}
                    placeholder="Enter secret key"
                    value={newConfig.secretKey}
                    onChange={(e) => updateNew({ secretKey: e.target.value })}
                    error={newConfigErrors.secretKey}
                    fullWidth
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret((s) => !s)}
                    className="absolute right-2 top-8 text-sm text-[var(--app-text-secondary)]"
                  >
                    {showSecret ? "Hide" : "Show"}
                  </button>
                </div>
                <Input
                  label="Bucket Name *"
                  placeholder="e.g. my-storage-bucket"
                  value={newConfig.bucketName}
                  onChange={(e) => updateNew({ bucketName: e.target.value })}
                  error={newConfigErrors.bucketName}
                  fullWidth
                />
              </div>
            )}

            {newConfig.storageTab === "connectionString" && (
              <Input
                label="Connection String *"
                placeholder="DefaultEndpointsProtocol=https;..."
                value={newConfig.accessKey}
                onChange={(e) => updateNew({ accessKey: e.target.value })}
                error={newConfigErrors.accessKey}
                fullWidth
              />
            )}
          </fieldset>

          <div className="border-t border-[var(--app-divider)]" />

          {/* Payment Gateway */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wide text-[var(--app-text-secondary)]">
              Payment Gateway
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Gateway Type
                </label>
                <select
                  value={newConfig.gatewayType}
                  onChange={(e) => updateNew({ gatewayType: e.target.value })}
                  className="h-11 rounded-lg border border-zinc-300 bg-transparent px-3 text-base transition-colors focus:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 dark:border-zinc-600"
                >
                  <option value="">Select gateway</option>
                  <option value="Razorpay">Razorpay</option>
                </select>
              </div>
              <Input
                label="Client ID / Key ID *"
                placeholder="rzp_live_..."
                value={newConfig.paymentKey}
                onChange={(e) => updateNew({ paymentKey: e.target.value })}
                error={newConfigErrors.paymentKey}
                fullWidth
              />
              <div className="relative">
                <Input
                  label="Payment Secret Key *"
                  type={showSecret ? "text" : "password"}
                  placeholder="Enter payment secret"
                  value={newConfig.paymentSecret}
                  onChange={(e) => updateNew({ paymentSecret: e.target.value })}
                  error={newConfigErrors.paymentSecret}
                  fullWidth
                />
                <button
                  type="button"
                  onClick={() => setShowSecret((s) => !s)}
                  className="absolute right-2 top-8 text-sm text-[var(--app-text-secondary)]"
                >
                  {showSecret ? "Hide" : "Show"}
                </button>
              </div>
              <Input
                label="Webhook URL *"
                placeholder="https://api.example.com/webhooks/payment"
                value={newConfig.webhookUrl}
                onChange={(e) => updateNew({ webhookUrl: e.target.value })}
                error={newConfigErrors.webhookUrl}
                fullWidth
              />
            </div>
          </fieldset>

          {modalSuccess && (
            <p className="text-sm font-medium text-emerald-600">{modalSuccess}</p>
          )}
        </div>
      </Modal>

      {/* Add Admin Modal */}
      <Modal
        open={adminModalOpen}
        onClose={onAdminModalClose}
        title="Add Admin"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={onAdminModalClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={onAdminSubmit}>
              Add Admin
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="First Name *"
              placeholder="e.g. Rajesh"
              value={newAdmin.firstName}
              onChange={(e) => updateAdmin({ firstName: e.target.value })}
              error={adminErrors.firstName}
              fullWidth
            />
            <Input
              label="Last Name *"
              placeholder="e.g. Kumar"
              value={newAdmin.lastName}
              onChange={(e) => updateAdmin({ lastName: e.target.value })}
              error={adminErrors.lastName}
              fullWidth
            />
            <Input
              label="Email Address *"
              type="email"
              placeholder="admin@school.com"
              value={newAdmin.email}
              onChange={(e) => updateAdmin({ email: e.target.value })}
              error={adminErrors.email}
              fullWidth
            />
            <Input
              label="Mobile Number *"
              type="tel"
              placeholder="+91 98765 43210"
              value={newAdmin.mobile}
              onChange={(e) => updateAdmin({ mobile: e.target.value })}
              error={adminErrors.mobile}
              fullWidth
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={newAdmin.role}
                onChange={(e) => updateAdmin({ role: e.target.value })}
                className={`h-11 rounded-lg border bg-transparent px-3 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground ${
                  adminErrors.role
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
              </select>
              {adminErrors.role && (
                <p className="text-sm text-red-600">{adminErrors.role}</p>
              )}
            </div>
            <Input
              label="Branch *"
              placeholder="e.g. Main Campus"
              value={newAdmin.branch}
              onChange={(e) => updateAdmin({ branch: e.target.value })}
              error={adminErrors.branch}
              fullWidth
            />
          </div>

          {adminSuccess && (
            <p className="text-sm font-medium text-emerald-600">{adminSuccess}</p>
          )}
        </div>
      </Modal>
    </div>
  );
}
