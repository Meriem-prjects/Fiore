import { prisma } from "@/lib/prisma";
import styles from "@/styles/admin.module.css";
import { LayoutDashboard, ShoppingBag, List, Layers, Users, CreditCard, DollarSign } from "lucide-react";

async function getStats() {
    const [
        productsCount,
        categoriesCount,
        subcategoriesCount,
        ordersCount,
        totalRevenue
    ] = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.subcategory.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } })
    ]);

    return {
        products: productsCount,
        categories: categoriesCount,
        subcategories: subcategoriesCount,
        orders: ordersCount,
        revenue: totalRevenue._sum.total || 0
    };
}

export default async function AdminDashboard() {
    const stats = await getStats();

    return (
        <div className={styles.adminMain}>
            <div className={styles.adminHeader}>
                <h1 className={styles.adminTitle}>Admin Dashboard</h1>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                <div className={styles.statCard} style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", padding: "1.5rem", borderRadius: "16px", color: "white" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.875rem", opacity: 0.8 }}>Total Revenue</span>
                        <DollarSign size={20} opacity={0.8} />
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800 }}>${stats.revenue.toFixed(2)}</div>
                </div>

                <div className={styles.statCard} style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Total Orders</span>
                        <CreditCard size={20} color="var(--primary)" />
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.orders}</div>
                </div>

                <div className={styles.statCard} style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Products</span>
                        <ShoppingBag size={20} color="var(--accent)" />
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.products}</div>
                </div>

                <div className={styles.statCard} style={{ background: "var(--surface)", padding: "1.5rem", borderRadius: "16px", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Categories</span>
                        <Layers size={20} color="var(--success)" />
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.categories}</div>
                </div>
            </div>

            <div style={{ marginTop: "3rem", padding: "2rem", background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)" }}>
                <h3 style={{ marginBottom: "1rem" }}>Recent Activity</h3>
                <p style={{ color: "#64748b" }}>No recent activity to show.</p>
            </div>
        </div>
    );
}
