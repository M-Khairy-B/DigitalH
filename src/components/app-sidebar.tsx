"use client"

import * as React from "react"
import {
    ArrowUpCircleIcon,
    BarChartIcon,
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"

const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Dashboard",
            url: "#",
            icon: LayoutDashboardIcon,
        },
        {
            title: "Lifecycle",
            url: "#",
            icon: ListIcon,
        },
        {
            title: "Analytics",
            url: "#",
            icon: BarChartIcon,
        },
        {
            title: "Projects",
            url: "#",
            icon: FolderIcon,
        },
        {
            title: "Team",
            url: "#",
            icon: UsersIcon,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:!p-1.5"
                        >
                            <a href="#">
                                <ArrowUpCircleIcon className="h-5 w-5" />
                                <span className="text-base font-semibold">Acme Inc.</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
