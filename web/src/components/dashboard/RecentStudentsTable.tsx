"use client";

const rows = [
  {
    name: "Marcus Thompson",
    idNumber: "ST-2024-001",
    major: "Computer Science",
    status: "Active" as const,
  },
  {
    name: "Elena Rodriguez",
    idNumber: "ST-2024-045",
    major: "Design & Arts",
    status: "On Probation" as const,
  },
  {
    name: "Julian Smith",
    idNumber: "ST-2024-089",
    major: "Business Admin",
    status: "Active" as const,
  },
  {
    name: "Dummy1",
    idNumber: "ST-2024-002",
    major: "Computer Science",
    status: "Active" as const,
  },
  {
    name: "Dummy2",
    idNumber: "ST-2024-003",
    major: "Design & Arts",
    status: "On Probation" as const,
  },
];

export function RecentStudentsTable() {
  return (
    <div
      className="rounded-[var(--app-card-radius)] border border-[var(--app-sidebar-border)] bg-[var(--app-card-bg)] shadow-[var(--app-card-shadow)] overflow-hidden"
    >
      <div className="flex flex-col gap-5 border-b border-[var(--app-divider)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-[var(--app-text-primary)]">
          Recent Students
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-search-border)] bg-[var(--app-card-bg)] text-[var(--app-nav-icon)] transition-colors hover:bg-[var(--app-nav-hover-bg)]"
            aria-label="Add Filters"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--app-search-border)] bg-[var(--app-card-bg)] text-[var(--app-nav-icon)] transition-colors hover:bg-[var(--app-nav-hover-bg)]"
            aria-label="More options"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--app-divider)] bg-[var(--app-search-bg)]">
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--app-text-secondary)]">
                STUDENT NAME
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--app-text-secondary)]">
                ID NUMBER
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--app-text-secondary)]">
                MAJOR
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--app-text-secondary)]">
                STATUS
              </th>
              <th className="px-6 py-4 font-semibold uppercase tracking-wider text-[var(--app-text-secondary)]">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ name, idNumber, major, status }) => (
              <tr
                key={idNumber}
                className="border-b border-[var(--app-divider)] transition-colors hover:bg-[var(--app-table-row-hover)] last:border-b-0"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--app-brand,#0b54ab)] text-sm font-medium text-white">
                      {name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-medium text-[var(--app-text-primary)]">
                      {name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[var(--app-text-secondary)]">
                  {idNumber}
                </td>
                <td className="px-6 py-4 text-[var(--app-text-primary)]">
                  {major}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor:
                        status === "Active"
                          ? "var(--app-success-bg)"
                          : "var(--app-warning-bg)",
                      color:
                        status === "Active"
                          ? "var(--app-success)"
                          : "var(--app-warning)",
                    }}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="rounded-lg px-3 py-1.5 font-medium text-[var(--app-link)] transition-colors hover:bg-[var(--app-warning-bg)]/50 hover:text-[var(--app-link-hover)]"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
