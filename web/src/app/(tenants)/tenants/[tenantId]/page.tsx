"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { initialTenants, Tenant } from "@/features/tenants/tenantData";
import TenantConfigurationTab from "./TenantConfigurationTab";
import TenantDetailsTab from "./TenantDetailsTab";

/**
 * Type definitions for Tenant Details Page
 */
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

/**
 * TenantDetailsTab - Read-only display of tenant information
 */



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
