import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import api from '../services/api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showMovModal, setShowMovModal] = useState(false)
  const [filter, setFilter] = useState('Todos')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 8
  const [form, setForm] = useState({ nombre: '', categoria: '', stock: '', descripcion: '' })
  const [mov, setMov] = useState({ producto_id: '', tipo: 'Entrada', cantidad: 1, motivo: '' })

  useEffect(() => { fetchProducts(); fetchMovements() }, [])

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMovements = async () => {
    try {
      const res = await api.get('/products/movements')
      setMovements(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await api.post('/products', form)
      fetchProducts()
      setShowModal(false)
      setForm({ nombre: '', categoria: '', stock: '', descripcion: '' })
    } catch (err) { console.error(err) }
  }

  const handleMovement = async (e) => {
    e.preventDefault()
    try {
      await api.post('/products/movements', mov)
      fetchProducts()
      fetchMovements()
      setShowMovModal(false)
      setMov({ producto_id: '', tipo: 'Entrada', cantidad: 1, motivo: '' })
    } catch (err) { console.error(err) }
  }

  const catColors = {
    'LIMPIEZA EXTERIOR': { bg:'#dbeafe', color:'#1e40af' },
    'ACCESORIOS': { bg:'#fce7f3', color:'#9d174d' },
    'PROTECCIÓN': { bg:'#d1fae5', color:'#065f46' },
    'INTERIOR': { bg:'#fef3c7', color:'#92400e' },
  }

  const getCatStyle = (cat) => catColors[cat?.toUpperCase()] || { bg:'#f1f5f9', color:'#334155' }

  const filtered = products.filter(p => {
    const matchSearch = p.nombre?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'Todos' ? true : filter === 'Bajo Stock' ? p.stock <= 5 : true
    return matchSearch && matchFilter
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const stockColor = (s) => s <= 3 ? '#dc2626' : s <= 10 ? '#d97706' : '#16a34a'
  const stockBg = (s) => s <= 3 ? '#fee2e2' : s <= 10 ? '#fef3c7' : '#dcfce7'

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar />
        <div style={styles.content}>

          {/* Header */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>Productos</h1>
              <p style={styles.pageSubtitle}>Gestiona el inventario de suministros para el lavado y mantenimiento de flota.</p>
            </div>
            <div style={styles.headerBtns}>
              <button style={styles.btnSecondary} onClick={() => setShowMovModal(true)}>
                Registrar Movimiento
              </button>
              <button style={styles.btnPrimary} onClick={() => setShowModal(true)}>
                + Nuevo Producto
              </button>
            </div>
          </div>

          <div style={styles.twoCol}>
            {/* Tabla */}
            <div style={styles.tableSection}>
              {/* Tabs + Search */}
              <div style={styles.filterRow}>
                <div style={styles.tabs}>
                  {['Todos','Bajo Stock','Categorías','Proveedores'].map(f => (
                    <button
                      key={f}
                      style={{...styles.tab, ...(filter===f ? styles.tabActive : {})}}
                      onClick={() => { setFilter(f); setPage(1) }}
                    >{f}</button>
                  ))}
                </div>
              </div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['ID','Producto','Categoría','Stock','Acciones'].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="5" style={styles.empty}>Cargando...</td></tr>
                    ) : paginated.length === 0 ? (
                      <tr><td colSpan="5" style={styles.empty}>No hay productos</td></tr>
                    ) : paginated.map(p => (
                      <tr key={p.id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.idBadge}>#{String(p.id).padStart(3,'0')}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.productCell}>
                            <div style={styles.productIcon}>📦</div>
                            <div>
                              <div style={styles.productName}>{p.nombre}</div>
                              <div style={styles.productDesc}>{p.descripcion}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={{...styles.catBadge, background: getCatStyle(p.categoria).bg, color: getCatStyle(p.categoria).color}}>
                            {p.categoria}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.stockCell}>
                            <span style={{...styles.stockBadge, background: stockBg(p.stock), color: stockColor(p.stock)}}>
                              {p.stock} unid.
                            </span>
                            <div style={styles.stockBar}>
                              <div style={{...styles.stockFill, width:`${Math.min(100, (p.stock/50)*100)}%`, background: stockColor(p.stock)}}/>
                            </div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <button style={styles.menuBtn}>⋮</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div style={styles.pagination}>
                <button style={{...styles.pageBtn, opacity:page===1?0.4:1}} onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1}>Anterior</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} style={{...styles.pageBtn,...(page===n?styles.pageBtnActive:{})}} onClick={()=>setPage(n)}>{n}</button>
                ))}
                <button style={{...styles.pageBtn, opacity:page===totalPages?0.4:1}} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Siguiente</button>
              </div>
            </div>

            {/* Historial */}
            <div style={styles.historySection}>
              <div style={styles.historyHeader}>
                <h3 style={styles.historyTitle}>Historial de Movimientos</h3>
                <button style={styles.verTodoBtn}>Ver Todo</button>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {['Fecha','Producto','Tipo','Cantidad'].map(h=>(
                      <th key={h} style={styles.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {movements.length === 0 ? (
                    <tr><td colSpan="4" style={styles.empty}>Sin movimientos</td></tr>
                  ) : movements.slice(0,5).map((m,i) => (
                    <tr key={i} style={styles.tr}>
                      <td style={styles.td}><span style={styles.dateText}>{m.fecha || 'Hoy'}</span></td>
                      <td style={styles.td}><span style={styles.productName}>{m.producto}</span></td>
                      <td style={styles.td}>
                        <span style={{...styles.tipoBadge, color: m.tipo==='ENTRADA'?'#16a34a':'#dc2626'}}>
                          {m.tipo==='ENTRADA' ? '↑ ENTRADA' : '↓ SALIDA'}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{color: m.tipo==='ENTRADA'?'#16a34a':'#dc2626', fontWeight:600}}>
                          {m.tipo==='ENTRADA'?'+':'-'}{m.cantidad}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* Modal Nuevo Producto */}
      {showModal && (
        <div style={styles.overlay} onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Nuevo Producto</h2>
              <button style={styles.closeBtn} onClick={()=>setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate}>
              {[
                {label:'Nombre',key:'nombre',placeholder:'Ej. Shampoo Premium'},
                {label:'Categoría',key:'categoria',placeholder:'Ej. LIMPIEZA EXTERIOR'},
                {label:'Stock inicial',key:'stock',placeholder:'0',type:'number'},
                {label:'Descripción',key:'descripcion',placeholder:'Descripción del producto'},
              ].map(f=>(
                <div key={f.key} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <input style={styles.input} type={f.type||'text'} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} required/>
                </div>
              ))}
              <button type="submit" style={styles.btnPrimary}>Crear Producto</button>
              <button type="button" style={{...styles.btnOutline,marginTop:'8px'}} onClick={()=>setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Movimiento */}
      {showMovModal && (
        <div style={styles.overlay} onClick={e=>e.target===e.currentTarget&&setShowMovModal(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Registrar Movimiento</h2>
              <button style={styles.closeBtn} onClick={()=>setShowMovModal(false)}>✕</button>
            </div>
            <p style={styles.modalSubtitle}>Actualiza el stock manualmente por uso o reposición.</p>
            <form onSubmit={handleMovement}>
              <div style={styles.field}>
                <label style={styles.label}>Producto</label>
                <select style={styles.input} value={mov.producto_id} onChange={e=>setMov({...mov,producto_id:e.target.value})} required>
                  <option value="">Seleccionar producto...</option>
                  {products.map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select>
              </div>
              <div style={styles.twoFields}>
                <div style={styles.field}>
                  <label style={styles.label}>Tipo</label>
                  <div style={styles.tipoTabs}>
                    {['Entrada','Salida'].map(t=>(
                      <button key={t} type="button" style={{...styles.tipoTab,...(mov.tipo===t?styles.tipoTabActive:{})}} onClick={()=>setMov({...mov,tipo:t})}>{t}</button>
                    ))}
                  </div>
                </div>
                <div style={styles.field}>
                  <label style={styles.label}>Cantidad</label>
                  <input style={styles.input} type="number" min="1" value={mov.cantidad} onChange={e=>setMov({...mov,cantidad:e.target.value})} required/>
                </div>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Motivo / Nota</label>
                <textarea style={{...styles.input,height:'80px',resize:'none'}} placeholder="Ej. Reposición mensual de proveedor..." value={mov.motivo} onChange={e=>setMov({...mov,motivo:e.target.value})}/>
              </div>
              <button type="submit" style={styles.btnPrimary}>Confirmar Movimiento</button>
              <button type="button" style={{...styles.btnOutline,marginTop:'8px'}} onClick={()=>setShowMovModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  layout:{display:'flex',minHeight:'100vh',background:'#f0f4f8',fontFamily:"'DM Sans',sans-serif"},
  main:{marginLeft:'220px',flex:1},
  content:{marginTop:'60px',padding:'2rem'},
  pageHeader:{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1.5rem'},
  pageTitle:{fontFamily:"'Sora',sans-serif",fontSize:'1.8rem',fontWeight:600,color:'#0f1f3d',margin:0},
  pageSubtitle:{fontSize:'14px',color:'#8a96a8',marginTop:'4px'},
  headerBtns:{display:'flex',gap:'10px'},
  btnPrimary:{padding:'10px 20px',background:'#1e3a6e',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"},
  btnSecondary:{padding:'10px 20px',background:'#fff',color:'#1e3a6e',border:'1.5px solid #1e3a6e',borderRadius:'10px',fontSize:'14px',fontWeight:500,cursor:'pointer'},
  btnOutline:{width:'100%',padding:'11px',background:'#fff',color:'#4a5568',border:'1px solid #dde3ec',borderRadius:'10px',fontSize:'14px',cursor:'pointer'},
  twoCol:{display:'grid',gridTemplateColumns:'1fr 380px',gap:'1.5rem'},
  tableSection:{display:'flex',flexDirection:'column',gap:'1rem'},
  filterRow:{display:'flex',alignItems:'center',gap:'8px'},
  tabs:{display:'flex',gap:'4px',background:'#fff',padding:'4px',borderRadius:'10px',border:'1px solid #e2e8f0'},
  tab:{padding:'7px 14px',border:'none',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:'none',color:'#4a5568',fontFamily:"'DM Sans',sans-serif"},
  tabActive:{background:'#1e3a6e',color:'#fff',fontWeight:500},
  tableWrap:{background:'#fff',borderRadius:'16px',border:'1px solid #e2e8f0',overflow:'hidden'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'12px 16px',textAlign:'left',fontSize:'12px',fontWeight:600,color:'#8a96a8',textTransform:'uppercase',letterSpacing:'0.05em',borderBottom:'1px solid #e2e8f0'},
  tr:{borderBottom:'1px solid #f0f4f8'},
  td:{padding:'14px 16px',fontSize:'14px',color:'#0f1f3d'},
  empty:{padding:'2rem',textAlign:'center',color:'#8a96a8',fontSize:'14px'},
  idBadge:{fontSize:'12px',color:'#8a96a8',fontFamily:'monospace'},
  productCell:{display:'flex',alignItems:'center',gap:'10px'},
  productIcon:{fontSize:'20px'},
  productName:{fontWeight:500,fontSize:'14px'},
  productDesc:{fontSize:'12px',color:'#8a96a8'},
  catBadge:{padding:'3px 10px',borderRadius:'6px',fontSize:'11px',fontWeight:600,letterSpacing:'0.03em'},
  stockCell:{display:'flex',flexDirection:'column',gap:'4px'},
  stockBadge:{padding:'3px 8px',borderRadius:'6px',fontSize:'12px',fontWeight:600,display:'inline-block'},
  stockBar:{width:'80px',height:'4px',background:'#f1f5f9',borderRadius:'4px',overflow:'hidden'},
  stockFill:{height:'100%',borderRadius:'4px',transition:'width .3s'},
  menuBtn:{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'#8a96a8',padding:'4px 8px'},
  pagination:{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',marginTop:'1rem'},
  pageBtn:{padding:'8px 14px',border:'1px solid #e2e8f0',borderRadius:'8px',background:'#fff',fontSize:'13px',cursor:'pointer',color:'#4a5568'},
  pageBtnActive:{background:'#1e3a6e',color:'#fff',border:'1px solid #1e3a6e'},
  historySection:{background:'#fff',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'1.25rem',height:'fit-content'},
  historyHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'},
  historyTitle:{fontFamily:"'Sora',sans-serif",fontSize:'1rem',fontWeight:600,color:'#0f1f3d'},
  verTodoBtn:{background:'none',border:'none',color:'#1e3a6e',fontSize:'13px',cursor:'pointer',fontWeight:500},
  dateText:{fontSize:'12px',color:'#8a96a8'},
  tipoBadge:{fontSize:'12px',fontWeight:600},
  overlay:{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:100},
  modal:{background:'#fff',borderRadius:'18px',padding:'2rem',width:'100%',maxWidth:'420px',maxHeight:'90vh',overflowY:'auto'},
  modalHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'},
  modalTitle:{fontFamily:"'Sora',sans-serif",fontSize:'1.1rem',fontWeight:600,color:'#0f1f3d'},
  modalSubtitle:{fontSize:'13px',color:'#8a96a8',marginBottom:'1.2rem'},
  closeBtn:{background:'none',border:'none',cursor:'pointer',fontSize:'16px',color:'#8a96a8'},
  field:{marginBottom:'1rem'},
  label:{display:'block',fontSize:'12px',fontWeight:500,color:'#4a5568',marginBottom:'6px'},
  input:{width:'100%',padding:'10px 12px',border:'1px solid #dde3ec',borderRadius:'10px',fontSize:'14px',outline:'none',boxSizing:'border-box',fontFamily:"'DM Sans',sans-serif"},
  twoFields:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'},
  tipoTabs:{display:'flex',gap:'4px'},
  tipoTab:{flex:1,padding:'8px',border:'1px solid #dde3ec',borderRadius:'8px',fontSize:'13px',cursor:'pointer',background:'#fff',color:'#4a5568'},
  tipoTabActive:{background:'#1e3a6e',color:'#fff',border:'1px solid #1e3a6e'},
}