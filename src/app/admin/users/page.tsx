"use client";

import styles from "@/styles/admin.module.css";
import { Users as UsersIcon, Plus } from "lucide-react";

export default function UsersPage() {
    return (
        <div>
            <div className={styles.adminHeader}>
                <h1 className={styles.adminTitle}>Agents de Veille (Users)</h1>
                <button className={styles.adminBtn}>
                    <Plus size={20} />
                    <span>Nouveau Agent</span>
                </button>
            </div>

            <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <UsersIcon size={48} style={{ color: '#64748b', marginBottom: '1rem' }} />
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Gestion des Utilisateurs</h3>
                <p style={{ color: '#94a3b8' }}>Cette section permet de gérer les accès des serveurs et administrateurs.</p>
            </div>
        </div>
    );
}
