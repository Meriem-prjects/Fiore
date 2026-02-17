"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/admin.module.css";
import {
    LayoutDashboard,
    ShoppingBag,
    List,
    Layers,
    ArrowLeft,
    Package,
    ChevronLeft,
    ChevronRight,
    Users,
    FileText,
    Settings,
    Moon,
    Grid
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const topNavLinks = [
        { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { name: "Fiches", href: "/admin/products", icon: FileText },
        { name: "Catégories", href: "/admin/categories", icon: Grid },
        { name: "Importations", href: "/admin/stock", icon: Package },
        { name: "Agents de Veille", href: "/admin/users", icon: Users },
    ];

    const sidebarLinks = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Categories", href: "/admin/categories", icon: Layers },
        { name: "Subcategories", href: "/admin/subcategories", icon: List },
        { name: "Products", href: "/admin/products", icon: ShoppingBag },
        { name: "Stock", href: "/admin/stock", icon: Package },
    ];

    return (
        <div className={styles.adminContainer}>
            {/* Top Header */}
            <header className={styles.adminHeaderTop}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div className={styles.adminLogo} style={{ textAlign: 'left' }}>
                        <span style={{ color: 'white' }}>Fiore <span style={{ color: 'var(--primary)', fontWeight: '400' }}>Admin</span></span>
                    </div>

                    <nav className={styles.topNavItems}>
                        {topNavLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.topNavItem} ${pathname === link.href ? styles.topNavItemActive : ""}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <button style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <Moon size={20} />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 32, height: 32, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem', color: 'white' }}>
                            <span style={{ margin: 'auto' }}>WA</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: '600' }}>Admin</span>
                            <span style={{ color: '#64748b', fontSize: '0.7rem' }}>Déconnecter</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.adminContentArea}>
                {/* Collapsible Sidebar */}
                <aside className={`${styles.adminSidebar} ${collapsed ? styles.collapsed : ""}`}>
                    <button
                        className={styles.sidebarToggle}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>

                    <div style={{ padding: '0 0.5rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 1rem', display: collapsed ? 'none' : 'block' }}>
                            Structure
                        </span>
                    </div>

                    <nav className={styles.adminNav}>
                        {sidebarLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${styles.navLink} ${pathname === link.href ? styles.navLinkActive : ""}`}
                            >
                                <link.icon size={20} style={{ minWidth: '20px' }} />
                                <span className={styles.sidebarLabel}>{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                        <Link href="/" className={styles.navLink} style={{ color: 'var(--accent)' }}>
                            <ArrowLeft size={20} style={{ minWidth: '20px' }} />
                            <span className={styles.sidebarLabel}>Back to POS</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className={styles.adminMain}>
                    {children}
                </main>
            </div>
        </div>
    );
}
