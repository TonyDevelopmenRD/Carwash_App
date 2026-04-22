import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import api from '../services/api'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role_id: 1
  })

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await api.post('/users/', {
        username: form.username,
        email: form.email,
        password: form.password,
        role_id: Number(form.role_id)
      })
      fetchUsers()
      setShowModal(false)
      setForm({ username: '', email: '', password: '', role_id: 1 })
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al crear usuario.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await api.delete(`/users/${id}`)
      fetchUsers()
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = users.filter(u =>
    `${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )
  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const getInitials = (u) => u.username?.charAt(0).toUpperCase() || '?'
  const avatarColors = ['#1e3a6e', '#0f766e', '#7c3aed', '#b45309', '#be123c']
  const getColor = (i) => avatarColors[i % avatarColors.length]

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar />
        <div style={styles.content}>

          {/* Header */}
          <div style={styles.headerWrapper}>
            <div style={styles.headerCenter}>
              <h1 style={styles.pageTitle}>Usuarios</h1>
              <p style={styles.pageSubtitle}>Administra los accesos y roles de tu personal.</p>
            </div>
            <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>
              + Nuevo Usuario
            </button>
          </div>

          {/* Filtros */}
          <div style={styles.filters}>
            <input
              style={styles.searchInput}
              placeholder="Buscar usuarios..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
            />
            <span style={styles.count}>
              Mostrando {paginated.length} de {filtered.length} usuarios
            </span>
          </div>

          {/* Tabla */}
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {['ID', 'Usuario', 'Email', 'Rol', 'Creado', ''].map(h => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" style={styles.empty}>Cargando...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan="6" style={styles.empty}>No se encontraron usuarios</td></tr>
                ) : paginated.map((u, i) => (
                  <tr key={u.id} style={styles.tr}>
                    <td style={styles.td}>
                      <span style={styles.idBadge}>#{String(u.id).padStart(4, '0')}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.nameCell}>
                        <div style={{ ...styles.avatar, background: getColor(i) }}>
                          {getInitials(u)}
                        </div>
                        <span style={styles.name}>{u.username}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.email}>{u.email}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.roleBadge}>
                        {u.role?.name || 'Usuario'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.dateText}>
                        {u.created_at
                          ? (() => { try { return new Date(u.created_at).toLocaleDateString('es-MX') } catch { return '—' } })()
                          : '—'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.actionBtn, color: '#e53e3e' }}
                        onClick={() => handleDelete(u.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div style={styles.pagination}>
            <button
              style={{ ...styles.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >Anterior</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                style={{ ...styles.pageBtn, ...(page === n ? styles.pageBtnActive : {}) }}
                onClick={() => setPage(n)}
              >{n}</button>
            ))}
            <button
              style={{ ...styles.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >Siguiente</button>
          </div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={styles.overlay}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Nuevo Usuario</h2>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {error && <p style={styles.errorMsg}>{error}</p>}

            <form onSubmit={handleCreate}>
              <label style={styles.label}>Username *</label>
              <input
                style={styles.input}
                placeholder="Ej: juan123"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />

              <label style={styles.label}>Email *</label>
              <input
                style={styles.input}
                type="email"
                placeholder="usuario@carwash.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />

              <label style={styles.label}>Contraseña *</label>
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />

              <label style={styles.label}>Role ID</label>
              <input
                style={styles.input}
                type="number"
                placeholder="1"
                value={form.role_id}
                onChange={e => setForm({ ...form, role_id: e.target.value })}
                min="1"
              />

              <div style={styles.modalActions}>
                <button type="button" style={styles.btnSecondary} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" style={styles.btnPrimary}>
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f0f4f8', fontFamily: "'DM Sans', sans-serif" },
  main: { marginLeft: '220px', flex: 1 },
  content: { marginTop: '60px', padding: '2rem' },

  headerWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'relative',
    padding: '1.5rem 0 1.2rem',
  },
  headerCenter: { textAlign: 'center', flex: 1 },
  pageTitle: { fontSize: '2.2rem', fontWeight: '700', margin: '0 0 6px', color: '#1a202c' },
  pageSubtitle: { fontSize: '14px', color: '#8a96a8', margin: 0 },

  btnPrimary: {
    position: 'absolute',
    right: 0,
    top: '1.5rem',
    padding: '10px 22px',
    background: '#1e3a6e',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },

  filters: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' },
  searchInput: { padding: '9px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', width: '280px', outline: 'none' },
  count: { fontSize: '13px', color: '#8a96a8' },

  tableWrap: { background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#8a96a8', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' },
  tr: { borderBottom: '1px solid #f0f4f8' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#0f1f3d' },
  empty: { padding: '2rem', textAlign: 'center', color: '#8a96a8', fontSize: '14px' },

  idBadge: { fontSize: '12px', color: '#8a96a8', fontFamily: 'monospace' },
  nameCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600, color: '#fff', flexShrink: 0 },
  name: { fontWeight: 500 },
  email: { color: '#4a5568', fontSize: '13px' },
  roleBadge: { padding: '4px 10px', background: '#f1f5f9', color: '#334155', borderRadius: '6px', fontSize: '12px', fontWeight: 500 },
  dateText: { fontSize: '12px', color: '#8a96a8' },
  actionBtn: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px' },

  pagination: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '1.5rem' },
  pageBtn: { padding: '8px 14px', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#4a5568' },
  pageBtnActive: { background: '#1e3a6e', color: '#fff', border: '1px solid #1e3a6e' },

  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: '#fff', padding: '2rem', borderRadius: '16px', width: '380px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' },
  modalTitle: { margin: 0, fontSize: '1.2rem', fontWeight: '700' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#8a96a8' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' },
  input: { display: 'block', marginBottom: '14px', padding: '10px 12px', width: '100%', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' },
  modalActions: { display: 'flex', gap: '10px', marginTop: '6px' },
  btnSecondary: { flex: 1, padding: '10px', border: '1px solid #e2e8f0', background: '#fff', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' },
  errorMsg: { color: '#e53e3e', fontSize: '13px', marginBottom: '10px', background: '#fff5f5', padding: '8px', borderRadius: '6px' }
}