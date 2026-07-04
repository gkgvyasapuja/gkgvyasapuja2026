/** Sort key: initiated name when set, otherwise mundane (legal) name. */
export function offeringDisplayName(row: {
  user: { initiatedName: string; firstName: string; lastName: string };
}): string {
  const initiated = row.user.initiatedName?.trim();
  if (initiated) return initiated;
  return `${row.user.firstName} ${row.user.lastName}`.trim();
}

export function compareOfferingsByDisplayName<
  T extends {
    user: { initiatedName: string; firstName: string; lastName: string };
  },
>(a: T, b: T): number {
  return offeringDisplayName(a).localeCompare(offeringDisplayName(b), undefined, {
    sensitivity: "base",
  });
}

export function sortOfferingsByDisplayName<
  T extends {
    user: { initiatedName: string; firstName: string; lastName: string };
  },
>(rows: T[]): T[] {
  return [...rows].sort(compareOfferingsByDisplayName);
}
