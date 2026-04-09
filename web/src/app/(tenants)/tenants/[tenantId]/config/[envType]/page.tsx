"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ConfigSection } from "@/components/common";
import { Button, Input } from "@/components/ui";

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

const dummyConfigByEnv: Record<string, TenantConfig> = {
  production: {
    envType: "Production",
    configName: "Production Config",
    logoUrl: "https://assets.example.com/logo-prod.png",
    domainUrl: "https://app.example.com",
    backendUrl: "https://api.example.com",
    storageTab: "accessKeys",
    accessKey: "PROD_ACCESS_KEY_123456",
    secretKey: "PROD_SECRET_KEY_ABCDEF",
    bucketName: "prod-storage-bucket",
    gatewayType: "Razorpay",
    paymentKey: "rzp_live_PRODkeyXYZ",
    paymentSecret: "prod_secret_payment_key",
    webhookUrl: "https://api.example.com/webhooks/payment",
  },
  qa: {
    envType: "QA",
    configName: "QA Config",
    logoUrl: "https://assets.example.com/logo-qa.png",
    domainUrl: "https://qa.example.com",
    backendUrl: "https://qa-api.example.com",
    storageTab: "accessKeys",
    accessKey: "QA_ACCESS_KEY_654321",
    secretKey: "QA_SECRET_KEY_FEDCBA",
    bucketName: "qa-storage-bucket",
    gatewayType: "Razorpay",
    paymentKey: "rzp_test_QAkeyABC",
    paymentSecret: "qa_secret_payment_key",
    webhookUrl: "https://qa-api.example.com/webhooks/payment",
  },
  development: {
    envType: "Development",
    configName: "Development Config",
    logoUrl: "https://assets.example.com/logo-dev.png",
    domainUrl: "https://dev.example.com",
    backendUrl: "https://dev-api.example.com",
    storageTab: "accessKeys",
    accessKey: "DEV_ACCESS_KEY_000001",
    secretKey: "DEV_SECRET_KEY_111111",
    bucketName: "dev-storage-bucket",
    gatewayType: "Razorpay",
    paymentKey: "rzp_test_DEVkeyDEF",
    paymentSecret: "dev_secret_payment_key",
    webhookUrl: "https://dev-api.example.com/webhooks/payment",
  },
};

export default function EnvConfigPage() {
  const { tenantId, envType } = useParams<{ tenantId: string; envType: string }>();
  const router = useRouter();

  const envKey = (envType ?? "").toLowerCase();
  const defaultConfig = dummyConfigByEnv[envKey] ?? dummyConfigByEnv["development"];

  const [config, setConfig] = useState<TenantConfig>(defaultConfig);
  const [errors, setErrors] = useState<Partial<Record<keyof TenantConfig, string>>>({});
  const [showSuccess, setShowSuccess] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  useEffect(() => {
    const resolved = dummyConfigByEnv[(envType ?? "").toLowerCase()] ?? dummyConfigByEnv["development"];
    setConfig(resolved);
  }, [envType]);

  const updateConfig = (updates: Partial<TenantConfig>) =>
    setConfig((prev) => ({ ...prev, ...updates }));

  const validateInput = (field: keyof TenantConfig, value: string) => {
    if (!value.trim()) return "This field is required";
    if (["logoUrl", "domainUrl", "backendUrl", "webhookUrl"].includes(field)) {
      if (!/^https?:\/\//.test(value.trim())) return "Enter a valid URL";
    }
    return "";
  };

  const onSubmit = () => {
    const nextErrors: Partial<Record<keyof TenantConfig, string>> = {};
    (
      ["configName", "logoUrl", "domainUrl", "backendUrl", "accessKey", "secretKey", "bucketName", "paymentKey", "paymentSecret", "webhookUrl"] as (keyof TenantConfig)[]
    ).forEach((key) => {
      const error = validateInput(key, config[key] as string);
      if (error) nextErrors[key] = error;
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setShowSuccess("Configuration saved successfully");
    window.setTimeout(() => setShowSuccess(""), 3000);
  };

  const envLabel = defaultConfig.envType;

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5">
        <Button onClick={() => router.back()} variant="outline" size="sm">
          ← Back
        </Button>
        <h1 className="mt-4 text-2xl font-bold text-[var(--app-text-primary)]">
          {envLabel} Configuration
        </h1>
        <p className="mt-1 text-sm text-[var(--app-text-secondary)]">
          Manage settings for the {envLabel} environment
        </p>
      </div>

      <div className="space-y-4">
        <ConfigSection title="General">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--app-text-secondary)]">
              Environment Type
            </label>
            <select
              value={config.envType}
              onChange={(e) => updateConfig({ envType: e.target.value })}
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
            onChange={(e) => updateConfig({ configName: e.target.value })}
            error={errors.configName}
            fullWidth
          />
        </ConfigSection>

        <ConfigSection title="Domain Settings">
          <Input
            label="Logo URL"
            value={config.logoUrl}
            onChange={(e) => updateConfig({ logoUrl: e.target.value })}
            error={errors.logoUrl}
            fullWidth
          />
          <Input
            label="Domain URL"
            value={config.domainUrl}
            onChange={(e) => updateConfig({ domainUrl: e.target.value })}
            error={errors.domainUrl}
            fullWidth
          />
          <Input
            label="Backend API URL"
            value={config.backendUrl}
            onChange={(e) => updateConfig({ backendUrl: e.target.value })}
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
                onClick={() => updateConfig({ storageTab: "accessKeys" })}
              >
                Access Keys
              </button>
              <button
                type="button"
                className={`rounded-md px-3 py-2 text-sm transition ${config.storageTab === "connectionString" ? "bg-foreground text-background" : "border border-zinc-300 bg-white"}`}
                onClick={() => updateConfig({ storageTab: "connectionString" })}
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
                onChange={(e) => updateConfig({ accessKey: e.target.value })}
                error={errors.accessKey}
                fullWidth
              />
              <div className="relative">
                <Input
                  label="Secret Key"
                  type={showSecret ? "text" : "password"}
                  value={config.secretKey}
                  onChange={(e) => updateConfig({ secretKey: e.target.value })}
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
                onChange={(e) => updateConfig({ bucketName: e.target.value })}
                error={errors.bucketName}
                fullWidth
              />
            </>
          )}

          {config.storageTab === "connectionString" && (
            <Input
              label="Connection String"
              value={config.accessKey}
              onChange={(e) => updateConfig({ accessKey: e.target.value })}
              error={errors.accessKey}
              fullWidth
            />
          )}
        </ConfigSection>

        <ConfigSection title="Payment Gateway">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--app-text-secondary)]">
              Gateway Type
            </label>
            <select
              value={config.gatewayType}
              onChange={(e) => updateConfig({ gatewayType: e.target.value })}
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
            onChange={(e) => updateConfig({ paymentKey: e.target.value })}
            error={errors.paymentKey}
            fullWidth
          />
          <div className="relative">
            <Input
              label="Secret Key"
              type={showSecret ? "text" : "password"}
              value={config.paymentSecret}
              onChange={(e) => updateConfig({ paymentSecret: e.target.value })}
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
            onChange={(e) => updateConfig({ webhookUrl: e.target.value })}
            error={errors.webhookUrl}
            fullWidth
          />
        </ConfigSection>

        <div className="mt-4 text-sm text-emerald-600">{showSuccess}</div>

        <div className="sticky bottom-0 z-20 mt-6 rounded-md border-t bg-[var(--app-card-bg)] py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={onSubmit} fullWidth className="sm:w-auto">
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
