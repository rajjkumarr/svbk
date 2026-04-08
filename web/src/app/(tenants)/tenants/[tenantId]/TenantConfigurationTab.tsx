import { ConfigSection, TenantCardHeader } from "@/components/common";
import { TenantCard } from "@/components/common/TenantCard/TenantCard";
import { Button, Input } from "@/components/ui";
import { env } from "process";
import { useState } from "react";

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
 * TenantConfigurationTab - Editable configuration settings for a tenant
 * Includes domain, storage, and payment gateway configurations
 */

export default function TenantConfigurationTab({
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
     
    const [selectedId, setSelectedId] = useState<string>("tenant1");

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

  const onCardSelect = (id: string) => {
    setSelectedId(id);
    // Handle tenant card selection if needed
    };

    const cardData=[{
    id: "tenant1",
    envType: "Production",
    schoolName: "Greenwood High School",
    },
{
    id: "tenant2",
    envType: "QA",
    schoolName: "Oakwood Middle School",
},
{
    id: "tenant3",
    envType: "Development",
    schoolName: "Lakeside Elementary",
}
]

  return (
    <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
         {cardData.map((tenant) => (

              <TenantCard
                key={tenant.id}
                // tenant={tenant}
                isSelected={selectedId === tenant.id}
                onClick={() => onCardSelect(tenant.id)}
              >
                <TenantCardHeader
                  title={tenant.envType}
                //   subtitle={tenant.campusName}
                  showCheckmark={selectedId === tenant.id}
                />
                {/* <TenantCardContent>
                  <TenantCardField label="School Code" value={tenant.schoolCode} size="sm" />
                  <TenantCardField label="Tenant Code" value={tenant.tenantCode} size="sm" />
                  <TenantCardField label="Location" value={`${tenant.city}, ${tenant.state}`} size="sm" />
                </TenantCardContent> */}

              </TenantCard>
            ))}
        </div>  
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