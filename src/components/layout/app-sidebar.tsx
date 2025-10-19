"use client"

import { NavMain } from '@/components/layout/nav-main'
import { NavUserAuth } from '@/components/layout/nav-user-auth'
import { SidebarProvider, SidebarInset, Sidebar, SidebarTrigger, SidebarHeader } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { APP_CONFIG, NAVIGATION_ITEMS } from '@/lib/constants'

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">AP</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{APP_CONFIG.name}</span>
                <span className="text-xs text-muted-foreground">{APP_CONFIG.version}</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </SidebarHeader>
        <Separator />
        <NavMain items={NAVIGATION_ITEMS} />
        <NavUserAuth />
      </Sidebar>
      <SidebarInset>
        <SidebarHeader className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Accounting Dashboard</h1>
        </SidebarHeader>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}