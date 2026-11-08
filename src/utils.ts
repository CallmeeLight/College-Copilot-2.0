export function getRealtimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

export function getAccountHolderName(user: { displayName?: string | null; isAnonymous?: boolean } | null): string {
  if (!user) {
    return "Student";
  }
  if (user.displayName && user.displayName.trim().length > 0) {
    return user.displayName;
  }
  if (user.isAnonymous) {
    return "Guest Student";
  }
  return "Student";
}
