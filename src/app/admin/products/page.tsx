"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css";
import { Plus, X, Edit, Trash2 } from "lucide-react";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        categoryId: "",
        subcategoryId: "",
        attributes: {} as any
    });

    const [ingredientsList, setIngredientsList] = useState<any[]>([]);
    const [selectedIngredients, setSelectedIngredients] = useState<any[]>([]);
    const [currentIng, setCurrentIng] = useState({ id: "", quantity: "" });

    useEffect(() => {
        fetchData();
        fetchIngredients();
        // eslint-disable-next-line
    }, []);

    const fetchIngredients = async () => {
        const res = await fetch("/api/inventory");
        const data = await res.json();
        setIngredientsList(Array.isArray(data) ? data : []);
    };

    const fetchData = async () => {
        const [prods, cats, subs] = await Promise.all([
            fetch("/api/products").then(res => res.json()),
            fetch("/api/categories").then(res => res.json()),
            fetch("/api/subcategories").then(res => res.json())
        ]);
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setSubcategories(Array.isArray(subs) ? subs : []);
    };

    const handleEdit = (product: any) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            categoryId: product.categoryId,
            subcategoryId: product.subcategoryId || "",
            attributes: product.attributes || {}
        });
        setSelectedIngredients(product.ingredients?.map((pi: any) => ({
            id: pi.inventoryItemId,
            name: pi.inventoryItem?.name,
            quantity: pi.quantityRequired
        })) || []);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            await fetch(`/api/products/${id}`, { method: "DELETE" });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({ ...formData, categoryId: e.target.value, subcategoryId: "" });
    };

    const filteredSubcategories = subcategories.filter(s => s.categoryId === formData.categoryId);
    const selectedCategory = categories.find(c => c.id === formData.categoryId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/products/${editingId}` : "/api/products";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    ingredients: selectedIngredients.map(i => ({ id: i.id, quantity: i.quantity }))
                })
            });
            if (res.ok) {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: "", price: "", categoryId: "", subcategoryId: "", attributes: {} });
                setSelectedIngredients([]);
                fetchData();
            } else {
                const err = await res.json();
                console.error("Failed to save product:", err);
                alert("Failed to save product: " + (err.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error occurred");
        }
    };

    return (
        <div>
            <div className={styles.adminHeader}>
                <h1 className={styles.adminTitle}>Products</h1>
                <button
                    className={styles.adminBtn}
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({ name: "", price: "", categoryId: "", subcategoryId: "", attributes: {} });
                        setSelectedIngredients([]);
                    }}
                >
                    <Plus size={20} />
                    <span>New Product</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px', gridTemplateColumns: '1fr' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Product Name</label>
                            <input className={styles.formInput} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Price ($)</label>
                            <input type="number" step="0.01" className={styles.formInput} value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Category</label>
                            <select className={styles.formSelect} value={formData.categoryId} onChange={handleCategoryChange} required>
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Subcategory</label>
                            <select className={styles.formSelect} value={formData.subcategoryId} onChange={e => setFormData({ ...formData, subcategoryId: e.target.value })} disabled={!formData.categoryId}>
                                <option value="">Select Subcategory</option>
                                {filteredSubcategories.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Ingredients Management */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h4 style={{ color: '#e2e8f0', marginBottom: '0.5rem' }}>Recipe / Ingredients</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                            <select
                                className={styles.formSelect}
                                value={currentIng.id}
                                onChange={e => setCurrentIng({ ...currentIng, id: e.target.value })}
                                style={{ flex: 2 }}
                            >
                                <option value="">Select Ingredient</option>
                                {ingredientsList.map(item => (
                                    <option key={item.id} value={item.id}>{item.name} ({item.unit})</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Qty"
                                className={styles.formInput}
                                value={currentIng.quantity}
                                onChange={e => setCurrentIng({ ...currentIng, quantity: e.target.value })}
                                style={{ flex: 1 }}
                            />
                            <button
                                type="button"
                                className={styles.adminBtn}
                                onClick={() => {
                                    if (!currentIng.id || !currentIng.quantity) return;
                                    const selected = ingredientsList.find(i => i.id === currentIng.id);
                                    if (selected) {
                                        setSelectedIngredients([...selectedIngredients, { ...selected, quantity: currentIng.quantity }]);
                                        setCurrentIng({ id: "", quantity: "" });
                                    }
                                }}
                            >
                                Add
                            </button>
                        </div>
                        {selectedIngredients.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {selectedIngredients.map((ing, idx) => (
                                    <span key={idx} style={{ background: '#334155', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {ing.name}: {ing.quantity} {ing.unit}
                                        <button type="button" onClick={() => setSelectedIngredients(selectedIngredients.filter((_, i) => i !== idx))} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}>
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dynamic Fields based on Category Type */}
                    {selectedCategory?.type === 'BEVERAGE' && (
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--primary)' }}>
                            <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Beverage Details</h4>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Size Options (comma separated)</label>
                                <input
                                    className={styles.formInput}
                                    placeholder="S, M, L"
                                    value={formData.attributes?.sizes ? formData.attributes.sizes.join(', ') : ''}
                                    onChange={e => setFormData({ ...formData, attributes: { ...formData.attributes, sizes: e.target.value.split(',').map(s => s.trim()) } })}
                                />
                            </div>
                        </div>
                    )}

                    {selectedCategory?.type === 'FOOD' && (
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--success)' }}>
                            <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Food Details</h4>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Ingredients (Text)</label>
                                <textarea
                                    className={styles.formInput}
                                    rows={2}
                                    value={formData.attributes?.ingredients || ''}
                                    onChange={e => setFormData({ ...formData, attributes: { ...formData.attributes, ingredients: e.target.value } })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Allergens</label>
                                <input
                                    className={styles.formInput}
                                    placeholder="Peanuts, Gluten..."
                                    value={formData.attributes?.allergens || ''}
                                    onChange={e => setFormData({ ...formData, attributes: { ...formData.attributes, allergens: e.target.value } })}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className={styles.adminBtn} style={{ flex: 1, justifyContent: 'center' }}>
                            {editingId ? "Update Product" : "Save Product"}
                        </button>
                        <button type="button" onClick={() => setShowForm(false)} className={styles.adminBtn} style={{ background: '#ef4444' }}><X size={20} /></button>
                    </div>
                </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {products.map(p => (
                    <div key={p.id} style={{ background: '#1e293b', borderRadius: '12px', padding: '1rem', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem' }}>
                            <button
                                className={styles.adminBtnSecondary}
                                style={{ padding: '0.25rem' }}
                                onClick={() => handleEdit(p)}
                            >
                                <Edit size={14} />
                            </button>
                            <button
                                className={styles.adminBtnSecondary}
                                style={{ padding: '0.25rem', color: '#ef4444', borderColor: '#ef4444' }}
                                onClick={() => handleDelete(p.id)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1.5rem' }}>{p.image || '📦'}</span>
                            <span style={{ background: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', marginRight: '3rem' }}>{p.category?.name}</span>
                        </div>
                        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{p.name}</h3>
                        <div style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{p.subcategory?.name}</div>

                        {/* Show ingredients count if any */}
                        {p.ingredients && p.ingredients.length > 0 && (
                            <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem' }}>
                                {p.ingredients.length} Ingredients linked
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                            <span style={{ fontWeight: 700, color: 'var(--accent)' }}>${p.price.toFixed(2)}</span>
                            {p.attributes && Object.keys(p.attributes).length > 0 && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Has attributes</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
