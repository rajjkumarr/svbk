import { useState } from "react";

type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  role: string;
  branch: string;
};

const dummyAdmins: Admin[] = [
  {
    id: "a1",
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh.kumar@school.com",
    mobile: "+91 98765 43210",
    role: "Super Admin",
    branch: "Main Campus",
  },
  {
    id: "a2",
    firstName: "Priya",
    lastName: "Sharma",
    email: "priya.sharma@school.com",
    mobile: "+91 91234 56789",
    role: "Finance Admin",
    branch: "North Branch",
  },
  {
    id: "a3",
    firstName: "Anil",
    lastName: "Verma",
    email: "anil.verma@school.com",
    mobile: "+91 87654 32109",
    role: "Principal",
    branch: "South Branch",
  },
  {
    id: "a4",
    firstName: "Sneha",
    lastName: "Patel",
    email: "sneha.patel@school.com",
    mobile: "+91 99988 77665",
    role: "Operations Admin",
    branch: "Main Campus",
  },
  {
    id: "a5",
    firstName: "Mohammed",
    lastName: "Ali",
    email: "mohammed.ali@school.com",
    mobile: "+91 80001 23456",
    role: "IT Admin",
    branch: "East Branch",
  },
];

const roleBadgeColor: Record<string, string> = {
  "Super Admin": "bg-purple-100 text-purple-700",
  "Finance Admin": "bg-blue-100 text-blue-700",
  "Principal": "bg-emerald-100 text-emerald-700",
  "Operations Admin": "bg-amber-100 text-amber-700",
  "IT Admin": "bg-zinc-100 text-zinc-700",
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground">
      {initials}
    </div>
  );
}

export default function TenantAdminsTab() {
  const [admins] = useState<Admin[]>(dummyAdmins);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-[var(--app-divider)] bg-[var(--app-card-bg)]">
        {/* Desktop table */}
        <div className="hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--app-divider)] bg-zinc-50 dark:bg-zinc-800/40">
                <th className="px-4 py-3 text-left font-semibold text-[var(--app-text-secondary)]">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--app-text-secondary)]">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--app-text-secondary)]">
                  Mobile
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--app-text-secondary)]">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[var(--app-text-secondary)]">
                  Branch
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--app-divider)]">
              {admins.map((admin) => (
                <tr
                  key={admin.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={`${admin.firstName} ${admin.lastName}`} />
                      <span className="font-medium text-[var(--app-text-primary)]">
                        {admin.firstName} {admin.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--app-text-secondary)]">
                    {admin.email}
                  </td>
                  <td className="px-4 py-3 text-[var(--app-text-secondary)]">
                    {admin.mobile}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        roleBadgeColor[admin.role] ?? "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--app-text-secondary)]">
                    {admin.branch}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="divide-y divide-[var(--app-divider)] sm:hidden">
          {admins.map((admin) => (
            <div key={admin.id} className="px-4 py-4 space-y-2">
              <div className="flex items-center gap-3">
                <Avatar name={`${admin.firstName} ${admin.lastName}`} />
                <div>
                  <p className="font-medium text-[var(--app-text-primary)]">
                    {admin.firstName} {admin.lastName}
                  </p>
                  <p className="text-xs text-[var(--app-text-secondary)]">{admin.email}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 pl-12 text-xs text-[var(--app-text-secondary)]">
                <span>{admin.mobile}</span>
                <span>{admin.branch}</span>
              </div>
              <div className="pl-12">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    roleBadgeColor[admin.role] ?? "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  {admin.role}
                </span>
              </div>
            </div>
          ))}
        </div>

        {admins.length === 0 && (
          <div className="py-12 text-center text-sm text-[var(--app-text-secondary)]">
            No admins found. Click &quot;Add Admin&quot; to get started.
          </div>
        )}
      </div>
    </div>
  );
}
