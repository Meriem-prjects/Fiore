"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/admin.module.css";
import { Plus, Edit, Trash2, AlertTriangle, Package } from "lucide-react";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        category: "GENERAL",
        unit: "pcs",
        currentStock: "0",
        minStock: "5",
        costPerUnit: ""
    });

    const units = ["kg", "g", "L", "ml", "pcs"];
    const categories = ["GENERAL", "FOOD_INGREDIENT", "BEVERAGE_INGREDIENT", "PACKAGING"];

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/inventory");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            console.error(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId ? `/api/inventory/${editingId}` : "/api/inventory";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: "", category: "GENERAL", unit: "pcs", currentStock: "0", minStock: "5", costPerUnit: "" });
                fetchInventory();
            } else {
                const err = await res.json();
                alert("Failed to save: " + (err.error));
            }
        } catch (e) {
            alert("Network error");
        }
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            category: item.category,
            unit: item.unit,
            currentStock: item.currentStock.toString(),
            minStock: item.minStock.toString(),
            costPerUnit: item.costPerUnit ? item.costPerUnit.toString() : ""
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await fetch(`/api/inventory/${id}`, { method: "DELETE" });
            fetchInventory();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className={styles.adminHeader}>
                <h1 className={styles.adminTitle}>Stock / Inventory</h1>
                <button
                    className={styles.adminBtn}
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditingId(null);
                        setFormData({ name: "", category: "GENERAL", unit: "pcs", currentStock: "0", minStock: "5", costPerUnit: "" });
                    }}
                >
                    <Plus size={20} />
                    <span>New Item</span>
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className={styles.formGrid} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px' }}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Item Name</label>
                        <input className={styles.formInput} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Category</label>
                        <select className={styles.formSelect} value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Unit</label>
                        <select className={styles.formSelect} value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                            {units.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Current Stock</label>
                        <input type="number" step="0.01" className={styles.formInput} value={formData.currentStock} onChange={e => setFormData({ ...formData, currentStock: e.target.value })} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Min Alert Stock</label>
                        <input type="number" step="0.01" className={styles.formInput} value={formData.minStock} onChange={e => setFormData({ ...formData, minStock: e.target.value })} />
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Cost per Unit ($)</label>
                        <input type="number" step="0.01" className={styles.formInput} value={formData.costPerUnit} onChange={e => setFormData({ ...formData, costPerUnit: e.target.value })} />
                    </div>

                    <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem' }}>
                        <button type="submit" className={styles.adminBtn} style={{ flex: 1, justifyContent: 'center' }}>
                            {editingId ? "Update Item" : "Save Item"}
                        </button>
                        <button type="button" className={styles.adminBtn} style={{ background: '#ef4444' }} onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </form>
            )}

            {loading ? (
                <div style={{ color: '#94a3b8', textAlign: 'center' }}>Loading stock...</div>
            ) : (
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>Min Stock</th>
                            <th>Cost</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Package size={16} /> {item.name}
                                </td>
                                <td><span style={{ fontSize: '0.8rem', background: '#334155', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{item.category}</span></td>
                                <td>
                                    <span style={{
                                        color: item.currentStock <= item.minStock ? '#ef4444' : '#10b981',
                                        fontWeight: 700,
                                        display: 'flex', alignItems: 'center', gap: '0.5rem'
                                    }}>
                                        {item.currentStock <= item.minStock && <AlertTriangle size={16} />}
                                        {item.currentStock} {item.unit}
                                    </span>
                                </td>
                                <td style={{ color: '#94a3b8' }}>{item.minStock} {item.unit}</td>
                                <td>{item.costPerUnit ? `$${item.costPerUnit}` : '-'}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className={styles.adminBtnSecondary} onClick={() => handleEdit(item)}><Edit size={16} /></button>
                                        <button className={styles.adminBtnSecondary} style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
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
