"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { initialTenants, Tenant } from "@/features/tenants/tenantData";

type TenantDetailsTabProps = {
  tenant: Tenant;
};

type TenantConfig = {
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

function KeyValueField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-4"
      style={{
        borderColor: "var(--app-divider)",
        backgroundColor: "var(--app-card-bg)",
      }}
    >
      <span className="text-xs uppercase tracking-wide text-[var(--app-text-secondary)]">{label}</span>
      <span className="text-sm font-medium text-[var(--app-text-primary)]">{value || "-"}</span>
    </div>
  );
}

function ConfigSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h3 className="mb-3 text-lg font-semibold text-[var(--app-text-primary)]">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function TenantDetailsTab({ tenant }: TenantDetailsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <KeyValueField label="School Name" value={tenant.schoolName} />
          <KeyValueField label="School Code" value={tenant.schoolCode} />
          <KeyValueField label="Tenant Code" value={tenant.tenantCode} />
          <KeyValueField label="Campus" value={tenant.campusName} />
        </div>
      </Card>

      <Card>
        <div className="grid gap-4 sm:grid-cols-2">
          <KeyValueField label="Address" value={tenant.address} />
          <KeyValueField label="City" value={tenant.city} />
          <KeyValueField label="State" value={tenant.state} />
          <KeyValueField label="Country" value={tenant.country} />
        </div>
      </Card>
    </div>
  );
}

function TenantConfigurationTab({
  config,
  setConfig,
  errors,
  setErrors,
  showSuccess,
  setShowSuccess,
  showSecret,
  setShowSecret,
}: {
  config: TenantConfig;
  setConfig: (updates: Partial<TenantConfig>) => void;
  errors: Partial<Record<keyof TenantConfig, string>>;
  setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof TenantConfig, string>>>>;
  showSuccess: string;
  setShowSuccess: React.Dispatch<React.SetStateAction<string>>;
  showSecret: boolean;
  setShowSecret: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const validateInput = (field: keyof TenantConfig, value: string) => {
    if (!value.trim()) return "This field is required";
    if (field === "logoUrl" || field === "domainUrl" || field === "backendUrl" || field === "webhookUrl") {
      if (!/^https?:\/\//.test(value.trim())) return "Enter a valid URL";
    }
    return "";
  };

  const onSubmit = () => {
    const nextErrors: Partial<Record<keyof TenantConfig, string>> = {};
    (Object.keys(config) as (keyof TenantConfig)[]).forEach((key) => {
      if (key === "paymentSecret" || key === "secretKey" || key === "paymentKey" || key === "bucketName" || key === "envType" || key === "configName" || key === "logoUrl" || key === "domainUrl" || key === "backendUrl" || key === "webhookUrl") {
        const error = validateInput(key, config[key]);
        if (error) nextErrors[key] = error;
      }
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setShowSuccess("Configuration saved successfully");
    window.setTimeout(() => setShowSuccess(""), 3000);
  };

  return (
    <div className="space-y-4">
      <ConfigSection title="General">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--app-text-secondary)]">Environment Type</label>
          <select
            value={config.envType}
            onChange={(e) => setConfig({ envType: e.target.value })}
            className="h-11 rounded-lg border border-zinc-300 px-3 text-base focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">Select environment</option>
            <option value="Production">Production</option>
            <option value="QA">QA</option>
            <option value="Development">Development</option>
          </select>
          {errors.envType && <p className="text-sm text-red-600">{errors.envType}</p>}
        </div>

        <Input
          label="Configuration Name"
          value={config.configName}
          onChange={(e) => setConfig({ configName: e.target.value })}
          error={errors.configName}
          fullWidth
        />
      </ConfigSection>

      <ConfigSection title="Domain Settings">
        <Input
          label="Logo URL"
          value={config.logoUrl}
          onChange={(e) => setConfig({ logoUrl: e.target.value })}
          error={errors.logoUrl}
          fullWidth
        />
        <Input
          label="Domain URL"
          value={config.domainUrl}
          onChange={(e) => setConfig({ domainUrl: e.target.value })}
          error={errors.domainUrl}
          fullWidth
        />
        <Input
          label="Backend API URL"
          value={config.backendUrl}
          onChange={(e) => setConfig({ backendUrl: e.target.value })}
          error={errors.backendUrl}
          fullWidth
        />
      </ConfigSection>

      <ConfigSection title="File Storage">
        <div className="sm:col-span-2">
          <div className="flex gap-2">
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm transition ${config.storageTab === "accessKeys" ? "bg-foreground text-background" : "border border-zinc-300 bg-white"}`}
              onClick={() => setConfig({ storageTab: "accessKeys" })}
            >
              Access Keys
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-2 text-sm transition ${config.storageTab === "connectionString" ? "bg-foreground text-background" : "border border-zinc-300 bg-white"}`}
              onClick={() => setConfig({ storageTab: "connectionString" })}
            >
              Connection String
            </button>
          </div>
        </div>

        {(config.storageTab === "accessKeys" || !config.storageTab) && (
          <>
            <Input
              label="Client ID / Access Key"
              value={config.accessKey}
              onChange={(e) => setConfig({ accessKey: e.target.value })}
              error={errors.accessKey}
              fullWidth
            />
            <div className="relative">
              <Input
                label="Secret Key"
                type={showSecret ? "text" : "password"}
                value={config.secretKey}
                onChange={(e) => setConfig({ secretKey: e.target.value })}
                error={errors.secretKey}
                fullWidth
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2 top-8 text-sm text-[var(--app-text-secondary)]"
              >
                {showSecret ? "Hide" : "Show"}
              </button>
            </div>
            <Input
              label="Bucket Name"
              value={config.bucketName}
              onChange={(e) => setConfig({ bucketName: e.target.value })}
              error={errors.bucketName}
              fullWidth
            />
          </>
        )}

        {config.storageTab === "connectionString" && (
          <Input
            label="Connection String"
            value={config.accessKey}
            onChange={(e) => setConfig({ accessKey: e.target.value })}
            error={errors.accessKey}
            fullWidth
          />
        )}
      </ConfigSection>

      <ConfigSection title="Payment Gateway">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-[var(--app-text-secondary)]">Gateway Type</label>
          <select
            value={config.gatewayType}
            onChange={(e) => setConfig({ gatewayType: e.target.value })}
            className="h-11 rounded-lg border border-zinc-300 px-3 text-base focus:outline-none focus:ring-2 focus:ring-foreground/20"
          >
            <option value="">Select gateway</option>
            <option value="Razorpay">Razorpay</option>
          </select>
          {errors.gatewayType && <p className="text-sm text-red-600">{errors.gatewayType}</p>}
        </div>

        <Input
          label="Client ID / Key ID"
          value={config.paymentKey}
          onChange={(e) => setConfig({ paymentKey: e.target.value })}
          error={errors.paymentKey}
          fullWidth
        />
        <div className="relative">
          <Input
            label="Secret Key"
            type={showSecret ? "text" : "password"}
            value={config.paymentSecret}
            onChange={(e) => setConfig({ paymentSecret: e.target.value })}
            error={errors.paymentSecret}
            fullWidth
          />
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="absolute right-2 top-8 text-sm text-[var(--app-text-secondary)]"
          >
            {showSecret ? "Hide" : "Show"}
          </button>
        </div>
        <Input
          label="Webhook URL"
          value={config.webhookUrl}
          onChange={(e) => setConfig({ webhookUrl: e.target.value })}
          error={errors.webhookUrl}
          fullWidth
        />
      </ConfigSection>

      <div className="mt-4 text-sm text-emerald-600">{showSuccess ? showSuccess : ""}</div>

      <div className="sticky bottom-0 z-20 mt-6 rounded-md border-t bg-[var(--app-card-bg)] py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            onClick={onSubmit}
            fullWidth
            className="sm:w-auto"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TenantDetailsPage() {
  const { tenantId } = useParams();
  const router = useRouter();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"details" | "configuration">("details");
  const [showSuccess, setShowSuccess] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [config, setConfig] = useState<TenantConfig>({
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
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TenantConfig, string>>>({});

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      const found = initialTenants.find((item) => item.id === tenantId);
      if (!found) {
        setError("Tenant not found");
        setTenant(null);
      } else {
        setTenant(found);
      }
      setLoading(false);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [tenantId]);

  useEffect(() => {
    if (!tenant) return;
    setConfig((prev) => ({
      ...prev,
      envType: "Production",
      configName: `${tenant.schoolName} Default`,
      domainUrl: `https://${tenant.schoolCode.toLowerCase()}.example.com`,
      backendUrl: `https://${tenant.schoolCode.toLowerCase()}.api.example.com`,
      logoUrl: "https://via.placeholder.com/150",
    }));
  }, [tenant]);

  const visibleTenant = useMemo(() => tenant, [tenant]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="h-8 w-1/3 animate-pulse rounded-md bg-zinc-200"></div>
          <div className="h-6 w-1/2 animate-pulse rounded-md bg-zinc-200"></div>
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
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Button onClick={() => router.push("/tenants")} variant="outline" size="sm">
            ← Back
          </Button>
          <h1 className="mt-4 text-2xl font-bold text-[var(--app-text-primary)]">{visibleTenant.schoolName}</h1>
          <p className="mt-1 text-sm text-[var(--app-text-secondary)]">{visibleTenant.tenantCode} • {visibleTenant.campusName}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-nowrap gap-2 overflow-x-auto border-b border-zinc-200 pb-2">
        {[
          { id: "details", label: "Details" },
          { id: "configuration", label: "Configuration" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as "details" | "configuration")}
            className={`rounded-t-lg px-4 py-2 text-sm font-medium ${activeTab === tab.id ? "bg-[var(--app-card-bg)] text-foreground" : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === "details" && <TenantDetailsTab tenant={visibleTenant} />}
        {activeTab === "configuration" && (
          <TenantConfigurationTab
            config={config}
            setConfig={(updates) => setConfig((current) => ({ ...current, ...updates }))}
            errors={errors}
            setErrors={setErrors}
            showSuccess={showSuccess}
            setShowSuccess={setShowSuccess}
            showSecret={showSecret}
            setShowSecret={setShowSecret}
          />
        )}
      </div>
    </div>
  );
}
