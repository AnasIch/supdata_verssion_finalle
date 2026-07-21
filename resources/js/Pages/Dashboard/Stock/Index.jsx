import { useEffect } from "react";
import { Head } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import StockWorkspace from "@/Components/Stock/StockWorkspace";
import { useStockDashboard } from "@/Hooks/useStockDashboard";
import { setCurrentUser } from "@/lib/mockAuth";
export default function StockDashboard({ user }) { const dashboard=useStockDashboard(); const currentUser=user||dashboard.user; useEffect(()=>{setCurrentUser(currentUser)},[currentUser]); return <DashboardLayout title="Responsable stock" breadcrumbs={[{label:"Responsable stock"},{label:"Vue d’ensemble"}]} user={currentUser} showNotifications={false}><Head title="Responsable stock — SUPDATA"/><StockWorkspace dashboard={{...dashboard,user:currentUser}}/></DashboardLayout>; }
