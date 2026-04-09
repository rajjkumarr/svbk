"use client";

import { TenantCardHeader } from "@/components/common";
import { TenantCard } from "@/components/common/TenantCard/TenantCard";
import { useParams, useRouter } from "next/navigation";

const envCards = [
  {
    id: "development",
    envType: "Development",
    description: "Local development and feature testing",
    badge: "Dev",
  },
  {
    id: "qa",
    envType: "QA",
    description: "Quality assurance & testing environment",
    badge: "Test",
  },
  {
    id: "production",
    envType: "Production",
    description: "Live environment used by end users",
    badge: "Live",
  },
];

export default function TenantConfigurationTab() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const router = useRouter();

  const handleCardClick = (envId: string) => {
    router.push(`/tenants/${tenantId}/config/${envId}`);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--app-text-secondary)]">
        Select an environment to view and edit its configuration.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {envCards.map((card) => (
          <TenantCard
            key={card.id}
            isSelected={false}
            onClick={() => handleCardClick(card.id)}
          >
            <TenantCardHeader
              title={card.envType}
              subtitle={card.description}
              showCheckmark={false}
            />
          </TenantCard>
        ))}
      </div>
    </div>
  );
}
