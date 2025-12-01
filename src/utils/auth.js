export function requireAuth(requiredRole = null) {
  if (typeof window === "undefined") return null; // SSR safety

  const token = localStorage.getItem("token");
  const role  = localStorage.getItem("role");
  const name  = localStorage.getItem("name");

  // No login → redirect to login
  if (!token || !role) {
    window.location.href = "/login";
    return null;
  }

  // Restricted role check
  if (requiredRole && role !== requiredRole) {
    window.location.href = "/";
    return null;
  }

  return { token, role, name };
}
