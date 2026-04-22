import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import api from '../services/api'

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    license_plate: '',
    model: '',
    brand: '',
    client_id: ''
  })

  const [page, setPage] = useState(1)
  const perPage = 6

  useEffect(() => { fetchVehicles() }, [])

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await api.get('/vehicles/')
      setVehicles(res.data)
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
      await api.post('/vehicles/', {
        license_plate: form.license_plate,
        model: form.model || null,
        brand: form.brand || null,
        client_id: Number(form.client_id)
      })
      fetchVehicles()
      setShowModal(false)
      setForm({ license_plate: '', model: '', brand: '', client_id: '' })
    } catch (err) {
      console.error(err.response?.data || err)
      setError(err.response?.data?.detail || 'Error al crear el vehículo.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este vehículo?')) return
    try {
      await api.delete(`/vehicles/${id}`)
      fetchVehicles()
    } catch (err) {
      console.error(err)
    }
  }

  const totalPages = Math.ceil(vehicles.length / perPage)
  const paginated = vehicles.slice((page - 1) * perPage, page * perPage)
  const icons = ['🚗', '🚙', '🛻', '🚐', '🏎️', '🚕']

  return (
    <div style={s.layout}>
      <Sidebar />
      <div style={s.main}>
        <Topbar />
        <div style={s.content}>

          {/* Header */}
          <div style={s.headerWrapper}>
            <div style={s.headerCenter}>
              <h1 style={s.pageTitle}>Vehículos</h1>
              <p style={s.pageSubtitle}>
                Administra los vehículos registrados en CleaDrive.
              </p>
            </div>
            <button style={s.btnPrimary} onClick={() => setShowModal(true)}>
              + Nuevo Vehículo
            </button>
          </div>

          {/* Conteo */}
          <div style={s.tabsRow}>
            <span style={s.count}>{vehicles.length} vehículos registrados</span>
          </div>

          {/* Grid */}
          {loading ? (
            <div style={s.empty}>Cargando vehículos...</div>
          ) : paginated.length === 0 ? (
            <div style={s.empty}>No hay vehículos disponibles</div>
          ) : (
            <div style={s.grid}>
              {paginated.map((v, i) => (
                <div key={v.id} style={s.card}>
                  <div style={s.cardTop}>
                    <div style={s.cardIcon}>{icons[i % icons.length]}</div>
                    <span style={s.badge}>REGISTRADO</span>
                  </div>
                  <p style={s.cardId}>ID: #VHC-{String(v.id).padStart(3, '0')}</p>
                  <h3 style={s.cardName}>{v.brand} {v.model}</h3>
                  <p style={s.cardDesc}>Placa: {v.license_plate}</p>
                  <div style={s.cardMeta}>
                    <div>
                      <p style={s.metaLabel}>CLIENTE ID</p>
                      <p style={s.metaValue}>#{v.client_id}</p>
                    </div>
                  </div>
                  <div style={s.cardActions}>
                    <button
                      style={{ ...s.actionBtn, color: '#e53e3e' }}
                      onClick={() => handleDelete(v.id)}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          <div style={s.pagination}>
            <button
              style={{ ...s.pageBtn, opacity: page === 1 ? 0.4 : 1 }}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                style={{ ...s.pageBtn, ...(page === n ? s.pageBtnActive : {}) }}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              style={{ ...s.pageBtn, opacity: page === totalPages ? 0.4 : 1 }}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </button>
          </div>

        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={s.overlay}
          onClick={e => e.target === e.currentTarget && setShowModal(false)}
        >
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Nuevo Vehículo</h2>
              <button style={s.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {error && <p style={s.errorMsg}>{error}</p>}

            <form onSubmit={handleCreate}>
              <label style={s.label}>Placa *</label>
              <input
                style={s.input}
                placeholder="Ej: ABC-1234"
                value={form.license_plate}
                onChange={e => setForm({ ...form, license_plate: e.target.value })}
                required
              />

              <label style={s.label}>Marca</label>
              <input
                style={s.input}
                placeholder="Ej: Toyota"
                value={form.brand}
                onChange={e => setForm({ ...form, brand: e.target.value })}
              />

              <label style={s.label}>Modelo</label>
              <input
                style={s.input}
                placeholder="Ej: Corolla 2022"
                value={form.model}
                onChange={e => setForm({ ...form, model: e.target.value })}
              />

              <label style={s.label}>ID Cliente *</label>
              <input
                style={s.input}
                type="number"
                placeholder="Ej: 1"
                value={form.client_id}
                onChange={e => setForm({ ...form, client_id: e.target.value })}
                required
                min="1"
              />

              <div style={s.modalActions}>
                <button
                  type="button"
                  style={s.btnSecondary}
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" style={s.btnPrimary}>
                  Crear Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  layout: { display: 'flex', minHeight: '100vh', background: '#f0f4f8' },
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

  tabsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '1rem'
  },
  count: { fontSize: '13px', color: '#8a96a8' },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
  },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardIcon: { fontSize: '26px' },
  badge: {
    fontSize: '10px',
    background: '#dbeafe',
    color: '#1e40af',
    padding: '3px 8px',
    borderRadius: '6px',
    fontWeight: '600'
  },
  cardId: { fontSize: '11px', color: '#8a96a8', margin: '8px 0 2px' },
  cardName: { fontWeight: '700', margin: '4px 0', fontSize: '16px' },
  cardDesc: { fontSize: '13px', color: '#4a5568', margin: '4px 0' },
  cardMeta: { marginTop: '10px', borderTop: '1px solid #f0f4f8', paddingTop: '10px' },
  metaLabel: { fontSize: '10px', color: '#8a96a8', margin: 0, letterSpacing: '0.05em' },
  metaValue: { fontSize: '18px', fontWeight: '700', margin: '2px 0 0', color: '#1e3a6e' },
  cardActions: { marginTop: '10px', display: 'flex', justifyContent: 'flex-end' },
  actionBtn: { border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' },

  empty: { textAlign: 'center', padding: '3rem', color: '#8a96a8', fontSize: '15px' },

  pagination: { marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '4px' },
  pageBtn: {
    padding: '7px 12px',
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '13px'
  },
  pageBtnActive: { background: '#1e3a6e', color: '#fff', borderColor: '#1e3a6e' },

  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff', padding: '2rem',
    borderRadius: '16px', width: '380px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' },
  modalTitle: { margin: 0, fontSize: '1.2rem', fontWeight: '700' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#8a96a8' },
  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#4a5568', marginBottom: '4px' },
  input: {
    display: 'block', marginBottom: '14px', padding: '10px 12px',
    width: '100%', border: '1px solid #e2e8f0',
    borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box'
  },
  modalActions: { display: 'flex', gap: '10px', marginTop: '6px' },
  btnSecondary: {
    flex: 1, padding: '10px', border: '1px solid #e2e8f0',
    background: '#fff', borderRadius: '10px', cursor: 'pointer', fontSize: '14px'
  },
  errorMsg: {
    color: '#e53e3e', fontSize: '13px', marginBottom: '10px',
    background: '#fff5f5', padding: '8px', borderRadius: '6px'
  }
}