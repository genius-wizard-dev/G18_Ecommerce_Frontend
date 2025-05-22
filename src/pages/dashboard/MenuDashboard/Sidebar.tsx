import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Package, Ticket } from "lucide-react";
import React, { useState } from "react";

interface SidebarProps {
    activeTab: "products" | "coupons" | "stats";
    setActiveTab: (tab: "products" | "coupons" | "stats") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div
            className={cn(
                "min-h-screen bg-background border-r transition-all duration-300 flex flex-col justify-start items-center",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className={cn(isCollapsed ? "p-4 sticky top-[120px]" : "p-6 sticky top-[120px]")}>
                <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} mb-8`}>
                    {!isCollapsed && <h1 className="text-2xl font-bold">Dashboard</h1>}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="flex flex-col justify-center items-center cursor-pointer"
                    >
                        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
                <nav className="space-y-2">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full relative transition-all duration-300 rounded-lg group flex items-center cursor-pointer",
                            activeTab === "products"
                                ? "bg-primary/15 text-primary hover:bg-primary/25 font-semibold border-2 border-primary/30 shadow-md"
                                : "hover:bg-accent/50 border-2 border-transparent",
                            isCollapsed ? "justify-center px-0" : "justify-start gap-2"
                        )}
                        onClick={() => setActiveTab("products")}
                    >
                        <Package
                            className={cn(
                                "h-5 w-5 transition-colors duration-300",
                                activeTab === "products" ? "text-primary" : "text-muted-foreground"
                            )}
                        />
                        {!isCollapsed && (
                            <span
                                className={cn(
                                    "transition-all duration-300",
                                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                )}
                            >
                                Quản lý sản phẩm
                            </span>
                        )}
                        {activeTab === "products" && !isCollapsed && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full transition-all duration-300" />
                        )}
                    </Button>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full relative transition-all duration-300 rounded-lg group flex items-center cursor-pointer",
                            activeTab === "coupons"
                                ? "bg-primary/15 text-primary hover:bg-primary/25 font-semibold border-2 border-primary/30 shadow-md"
                                : "hover:bg-accent/50 border-2 border-transparent",
                            isCollapsed ? "justify-center px-0" : "justify-start gap-2"
                        )}
                        onClick={() => setActiveTab("coupons")}
                    >
                        <Ticket
                            className={cn(
                                "h-5 w-5 transition-colors duration-300",
                                activeTab === "coupons" ? "text-primary" : "text-muted-foreground"
                            )}
                        />
                        {!isCollapsed && (
                            <span
                                className={cn(
                                    "transition-all duration-300",
                                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                )}
                            >
                                Quản lý phiếu giảm giá
                            </span>
                        )}
                        {activeTab === "coupons" && !isCollapsed && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full transition-all duration-300" />
                        )}
                    </Button>

                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full relative transition-all duration-300 rounded-lg group flex items-center cursor-pointer",
                            activeTab === "stats"
                                ? "bg-primary/15 text-primary hover:bg-primary/25 font-semibold border-2 border-primary/30 shadow-md"
                                : "hover:bg-accent/50 border-2 border-transparent",
                            isCollapsed ? "justify-center px-0" : "justify-start gap-2"
                        )}
                        onClick={() => setActiveTab("stats")}
                    >
                        <Ticket
                            className={cn(
                                "h-5 w-5 transition-colors duration-300",
                                activeTab === "stats" ? "text-primary" : "text-muted-foreground"
                            )}
                        />
                        {!isCollapsed && (
                            <span
                                className={cn(
                                    "transition-all duration-300",
                                    isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                                )}
                            >
                                Thống kê doanh thu
                            </span>
                        )}
                        {activeTab === "stats" && !isCollapsed && (
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full transition-all duration-300" />
                        )}
                    </Button>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;
