"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function SubcategoriesPage() {
    const [subcategories, setSubcategories] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", categoryId: "" });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [subs, cats] = await Promise.all([
                fetch("/api/subcategories").then(res => res.json()),
                fetch("/api/categories").then(res => res.json())
            ]);
            setSubcategories(Array.isArray(subs) ? subs : []);
            setCategories(Array.isArray(cats) ? cats : []);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (subcategory: any) => {
        setEditingId(subcategory.id);
        setFormData({ name: subcategory.name, categoryId: subcategory.categoryId });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this subcategory?")) return;
        try {
            await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
            fetchData();
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.categoryId) return;
        try {
            const url = editingId ? `/api/subcategories/${editingId}` : "/api/subcategories";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: "", categoryId: "" });
                fetchData();
            } else {
                const err = await res.json();
                console.error("Failed to save subcategory:", err);
                alert("Failed to save subcategory: " + (err.error || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Network error occurred");
        }
    };

    return (
        <div>
            <div className={styles.adminHeader}>
                <h1 className={styles.adminTitle}>Subcategories</h1>
                <button
                    className={styles.adminBtn}
                    onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ name: "", categoryId: "" }); }}
                >
                    <Plus size={20} />
                    <span>New Subcategory</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Name</label>
                        <input className={styles.formInput} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Parent Category</label>
                        <select className={styles.formSelect} value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required>
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className={styles.adminBtn} style={{ flex: 1, justifyContent: 'center' }}>
                        {editingId ? "Update Subcategory" : "Save Subcategory"}
                    </button>
                </form>
            )}

            {loading ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
            ) : (
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Parent Category</th>
                            <th>Items Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subcategories.map(sub => (
                            <tr key={sub.id}>
                                <td>{sub.name}</td>
                                <td><span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem' }}>{sub.category?.name}</span></td>
                                <td>{sub._count?.products || 0}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className={styles.adminBtnSecondary} onClick={() => handleEdit(sub)}><Edit size={16} /></button>
                                        <button className={styles.adminBtnSecondary} style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(sub.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
