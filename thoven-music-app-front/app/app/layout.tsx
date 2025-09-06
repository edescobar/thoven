export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware handles authentication, so we just render children
  return <>{children}</>
}