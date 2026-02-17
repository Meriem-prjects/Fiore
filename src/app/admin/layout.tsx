import Link from "next/link";
import styles from "@/styles/admin.module.css";
import { LayoutDashboard, ShoppingBag, List, Layers, ArrowLeft, Package } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles.adminContainer}>
            <aside className={styles.adminSidebar}>
                <div className={styles.adminLogo}>
                    <span>Fiore Admin</span>
                </div>
                <nav className={styles.adminNav}>
                    <Link href="/admin" className={styles.navLink}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>
                    <Link href="/admin/categories" className={styles.navLink}>
                        <Layers size={20} />
                        Categories
                    </Link>
                    <Link href="/admin/subcategories" className={styles.navLink}>
                        <List size={20} />
                        Subcategories
                    </Link>
                    <Link href="/admin/products" className={styles.navLink}>
                        <ShoppingBag size={20} />
                        Products
                    </Link>
                    <Link href="/admin/stock" className={styles.navLink}>
                        <Package size={20} />
                        Stock
                    </Link>
                </nav>
                <Link href="/" className={styles.backToPos}>
                    <ArrowLeft size={20} />
                    Back to POS
                </Link>
            </aside>
            <main className={styles.adminMain}>
                {children}
            </main>
        </div>
    );
}
