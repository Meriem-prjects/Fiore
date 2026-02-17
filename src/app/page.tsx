"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.css";
import {
    Coffee,
    Pizza,
    IceCream,
    Utensils,
    Search,
    User,
    Trash2,
    Plus,
    Minus,
    CreditCard,
    Banknote,
    RefreshCw,
    CheckCircle2
} from "lucide-react";

export default function POSPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState("");
    const [cart, setCart] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [checkoutStatus, setCheckoutStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [catRes, prodRes] = await Promise.all([
                fetch("/api/categories"),
                fetch("/api/products")
            ]);
            const cats = await catRes.json();
            const prods = await prodRes.json();
            setCategories(cats);
            setProducts(prods);
            if (cats.length > 0) setActiveCategory(cats[0].id);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(
        (p) => p.categoryId === activeCategory && p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: any) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const handleCheckout = async (type: "CASH" | "CARD") => {
        if (cart.length === 0) return;
        setCheckoutStatus("PROCESSING");
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: cart,
                    total: total,
                    paymentType: type
                })
            });
            if (res.ok) {
                setCheckoutStatus("SUCCESS");
                setTimeout(() => {
                    setCart([]);
                    setCheckoutStatus("IDLE");
                }, 2000);
            }
        } catch (error) {
            console.error("Checkout failed:", error);
            setCheckoutStatus("IDLE");
        }
    };

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const getIcon = (name: string) => {
        switch (name) {
            case "Coffee": return <Coffee size={24} />;
            case "Pizza": return <Pizza size={24} />;
            case "IceCream": return <IceCream size={24} />;
            case "Utensils": return <Utensils size={24} />;
            default: return <Utensils size={24} />;
        }
    };

    if (loading) {
        return (
            <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", color: "white" }}>
                <RefreshCw className="spin" size={48} />
                <style jsx global>{`
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Sidebar - Categories */}
            <aside className={styles.sidebar}>
                <div style={{ marginBottom: "2rem", display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>F</div>
                </div>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.categoryBtnActive : ""}`}
                        onClick={() => setActiveCategory(cat.id)}
                        title={cat.name}
                    >
                        {getIcon(cat.icon)}
                    </button>
                ))}
            </aside>

            {/* Main Content - Products */}
            <main className={styles.main}>
                <header className={styles.header}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: 1 }}>
                        <div style={{ position: "relative", width: "300px" }}>
                            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={18} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                style={{
                                    width: "100%",
                                    padding: "0.6rem 1rem 0.6rem 2.5rem",
                                    borderRadius: "10px",
                                    background: "rgba(255,255,255,0.05)",
                                    border: "1px solid var(--border)",
                                    color: "white",
                                    outline: "none"
                                }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <button style={{ background: "var(--border)", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <User size={18} />
                            <span>Admin</span>
                        </button>
                    </div>
                </header>

                <section className={styles.productGrid}>
                    {filteredProducts.map((product) => (
                        <div key={product.id} className={styles.productCard} onClick={() => addToCart(product)}>
                            <div className={styles.productImage}>
                                <span style={{ fontSize: "3rem" }}>{product.image}</span>
                            </div>
                            <span className={styles.productName}>{product.name}</span>
                            <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                            <p>No products found in this category.</p>
                        </div>
                    )}
                </section>
            </main>

            {/* Right Panel - Cart */}
            <aside className={styles.cartPanel}>
                <div className={styles.cartHeader}>
                    <h3>Current Order</h3>
                    <button onClick={() => setCart([])} style={{ background: "transparent", border: 'none', color: '#ef4444', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={20} />
                    </button>
                </div>

                <div className={styles.cartItems}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: "center", color: "#64748b", marginTop: "4rem" }}>
                            <Utensils size={48} style={{ marginBottom: "1rem", opacity: 0.3 }} />
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className={styles.cartItem} onClick={() => addToCart(item)}>
                                <div className={styles.cartItemInfo}>
                                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                                    <div className={styles.cartItemQuantity}>
                                        <button className={styles.quantityBtn} onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1); }}>
                                            <Minus size={14} />
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button className={styles.quantityBtn} onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1); }}>
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                                <span style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))
                    )}
                </div>

                <div className={styles.checkoutSection}>
                    <div className={styles.summaryRow}>
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.summaryRow}>
                        <span>Tax (10%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        <button
                            onClick={() => handleCheckout("CASH")}
                            disabled={cart.length === 0 || checkoutStatus !== "IDLE"}
                            style={{ background: "rgba(255,255,255,0.05)", color: "white", padding: "0.75rem", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", border: "1px solid var(--border)", opacity: cart.length === 0 ? 0.5 : 1 }}
                        >
                            <Banknote size={20} style={{ color: '#10b981' }} />
                            <span style={{ fontSize: "0.8rem" }}>Cash</span>
                        </button>
                        <button
                            onClick={() => handleCheckout("CARD")}
                            disabled={cart.length === 0 || checkoutStatus !== "IDLE"}
                            style={{ background: "rgba(255,255,255,0.05)", color: "white", padding: "0.75rem", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", border: "1px solid var(--border)", opacity: cart.length === 0 ? 0.5 : 1 }}
                        >
                            <CreditCard size={20} style={{ color: '#3b82f6' }} />
                            <span style={{ fontSize: "0.8rem" }}>Card</span>
                        </button>
                    </div>

                    <button
                        className={styles.payBtn}
                        disabled={cart.length === 0 || checkoutStatus !== "IDLE"}
                        style={{
                            opacity: cart.length === 0 || checkoutStatus !== "IDLE" ? 0.5 : 1,
                            background: checkoutStatus === "SUCCESS" ? "var(--success)" : "var(--primary)"
                        }}
                    >
                        {checkoutStatus === "IDLE" && "Pay Now"}
                        {checkoutStatus === "PROCESSING" && <RefreshCw className="spin" size={20} />}
                        {checkoutStatus === "SUCCESS" && <><CheckCircle2 size={20} /> Paid</>}
                    </button>
                </div>
            </aside>

            <style jsx>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
}
