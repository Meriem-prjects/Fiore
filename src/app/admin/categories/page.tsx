"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: "", icon: "", type: "DEFAULT" });

    const types = ["DEFAULT", "FOOD", "BEVERAGE", "MERCH"];

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/categories");
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (category: any) => {
        setEditingId(category.id);
        setFormData({ name: category.name, icon: category.icon || "", type: category.type });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category?")) return;
        try {
            await fetch(`/api/categories/${id}`, { method: "DELETE" });
            fetchCategories();
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: "", icon: "", type: "DEFAULT" });
                fetchCategories();
            } else {
                const err = await res.json();
                console.error("Failed to save category:", err);
                alert("Failed to save category: " + (err.error || "Unknown error"));
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Network error occurred");
        }
    };

    return (
        <div>
            <div className={styles.adminHeader}>
                <h1 className={styles.adminTitle}>Categories</h1>
                <button
                    className={styles.adminBtn}
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({ name: "", icon: "", type: "DEFAULT" });
                    }}
                >
                    <Plus size={20} />
                    <span>New Category</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Name</label>
                        <input className={styles.formInput} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Type</label>
                        <select className={styles.formSelect} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                            {types.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className={styles.adminBtn} style={{ flex: 1, justifyContent: 'center' }}>
                            {editingId ? "Update Category" : "Save Category"}
                        </button>
                        <button type="button" className={styles.adminBtn} style={{ background: '#ef4444' }} onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            {loading ? (
                <div style={{ color: '#94a3b8', textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
            ) : (
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Items</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                <td><span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.875rem' }}>{category.type}</span></td>
                                <td>{category._count?.products || 0}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className={styles.adminBtnSecondary} onClick={() => handleEdit(category)}><Edit size={16} /></button>
                                        <button className={styles.adminBtnSecondary} style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(category.id)}><Trash2 size={16} /></button>
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
