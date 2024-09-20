"use client";
export interface PropsChildren {
  children: React.ReactNode
}
const Layout = ({ children }: PropsChildren) => {
  return (
    <div className="flex h-full justify-center items-center">
      <div className="md:h-auto md-w-[420px]">
        {children}
      </div>
    </div>
  )
}
export default Layout;