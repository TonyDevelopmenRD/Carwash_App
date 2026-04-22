import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import api from '../services/api'

export default function Citas() {
  const [citas, setCitas] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const perPage = 5
  const [form, setForm] = useState({
    cajero: '', lavador: '', servicio_id: '',
    vehiculo: '', fecha: '', hora: '', descuento: 0, estatus: 'En Cola'
  })

  useEffect(() => { Citas(); Services() }, [])

  const fetchCitas = async () => {
    try {
      const res = await api.get('/services/citas')
      setCitas(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/')
      setServices(res.data)
    } catch (err) { console.error(err) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/services/citas', form)
      fetchCitas()
      setForm({ cajero:'', lavador:'', servicio_id:'', vehiculo:'', fecha:'', hora:'', descuento:0, estatus:'En Cola' })
    } catch (err) { console.error(err) }
  }

  const totalPages = Math.ceil(citas.length / perPage)
  const paginated = citas.slice((page - 1) * perPage, page * perPage)

  const estatusStyle = (e) => ({
    'En Cola':    { bg:'#fef3c7', color:'#92400e' },
    'En Proceso': { bg:'#dbeafe', color:'#1e40af' },
    'Completado': { bg:'#dcfce7', color:'#166534' },
    'Cancelado':  { bg:'#fee2e2', color:'#991b1b' },
  }[e] || { bg:'#f1f5f9', color:'#334155' })

  const resumen = [
    { label:'En Espera', value: citas.filter(c=>c.estatus==='En Cola').length, icon:'📋' },
    { label:'En Proceso', value: citas.filter(c=>c.estatus==='En Proceso').length, icon:'⚙️' },
    { label:'Completados', value: citas.filter(c=>c.estatus==='Completado').length, icon:'✅' },
  ]

  return (
    <div style={styles.layout}>
      <Sidebar />
      <div style={styles.main}>
        <Topbar />
        <div style={styles.content}>

          {/* Header */}
          <div style={styles.pageHeader}>
            <div>
              <h1 style={styles.pageTitle}>Gestión de Citas</h1>
              <p style={styles.pageSubtitle}>Panel de control operativo en tiempo real.</p>
            </div>
            <div style={styles.statusBadge}>
              <span style={styles.dot}/>
              EN LÍNEA
            </div>
          </div>

          {/* Resumen */}
          <div style={styles.resumenGrid}>
            {resumen.map(r => (
              <div key={r.label} style={styles.resumenCard}>
                <span style={styles.resumenIcon}>{r.icon}</span>
                <div>
                  <div style={styles.resumenValue}>{r.value}</div>
                  <div style={styles.resumenLabel}>{r.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.twoCol}>
            {/* Formulario */}
            <div style={styles.formSection}>
              <h3 style={styles.sectionTitle}>Registrar Servicio</h3>
              <form onSubmit={handleSubmit}>
                <div style={styles.twoFields}>
                  <div style={styles.field}>
                    <label style={styles.label}>Cajero</label>
                    <input style={styles.input} placeholder="Seleccionar Cajero" value={form.cajero} onChange={e=>setForm({...form,cajero:e.target.value})} required/>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Lavador</label>
                    <input style={styles.input} placeholder="Seleccionar Lavador" value={form.lavador} onChange={e=>setForm({...form,lavador:e.target.value})} required/>
                  </div>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Servicio</label>
                  <select style={styles.input} value={form.servicio_id} onChange={e=>setForm({...form,servicio_id:e.target.value})} required>
                    <option value="">Seleccionar servicio...</option>
                    {services.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label}>Vehículo (Placa / Modelo)</label>
                  <input style={styles.input} placeholder="Ej. ABC-123 / Toyota Corolla" value={form.vehiculo} onChange={e=>setForm({...form,vehiculo:e.target.value})} required/>
                </div>

                <div style={styles.twoFields}>
                  <div style={styles.field}>
                    <label style={styles.label}>Fecha</label>
                    <input style={styles.input} type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} required/>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Hora</label>
                    <input style={styles.input} type="time" value={form.hora} onChange={e=>setForm({...form,hora:e.target.value})} required/>
                  </div>
                </div>

                <div style={styles.twoFields}>
                  <div style={styles.field}>
                    <label style={styles.label}>Descuento (%)</label>
                    <input style={styles.input} type="number" min="0" max="100" value={form.descuento} onChange={e=>setForm({...form,descuento:e.target.value})}/>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.label}>Estatus Inicial</label>
                    <select style={styles.input} value={form.estatus} onChange={e=>setForm({...form,estatus:e.target.value})}>
                      {['En Cola','En Proceso','Completado','Cancelado'].map(s=>(
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" style={styles.btnPrimary}>
                  Agendar Servicio →
                </button>
              </form>
            </div>

            {/* Tabla del día */}
            <div style={styles.tableSection}>
              <div style={styles.tableSectionHeader}>
                <h3 style={styles.sectionTitle}>Servicios del Día</h3>
                <div style={styles.tableIcons}>
                  <button style={styles.iconBtn}>⬇</button>
                </div>
              </div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      {['Hora','Cajero / Lavador','Servicio / Vehículo','Precio'].map(h=>(
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="4" style={styles.empty}>Cargando...</td></tr>
                    ) : paginated.length === 0 ? (
                      <tr><td colSpan="4" style={styles.empty}>No hay citas para hoy</td></tr>
                    ) : paginated.map(c => (
                      <tr key={c.id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.hora}>{c.hora}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.staffCell}>
                            <div style={styles.staffName}>{c.cajero}</div>
                            <div style={styles.staffSub}>Lav. {c.lavador}</div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.serviceCell}>
                            <div style={styles.serviceName}>{c.servicio}</div>
                            <div style={styles.vehicleText}>{c.vehiculo}</div>
                          </div>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.priceCell}>
                            <span style={styles.price}>${c.precio_final}</span>
                            <span style={{...styles.estatusBadge, background:estatusStyle(c.estatus).bg, color:estatusStyle(c.estatus).color}}>
                              {c.estatus}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              <div style={styles.pagination}>
                <button style={{...styles.pageBtn,opacity:page===1?0.4:1}} onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>‹</button>
                {Array.from({length:totalPages},(_,i)=>i+1).map(n=>(
                  <button key={n} style={{...styles.pageBtn,...(page===n?styles.pageBtnActive:{})}} onClick={()=>setPage(n)}>{n}</button>
                ))}
                <button style={{...styles.pageBtn,opacity:page===totalPages?0.4:1}} onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>›</button>
              </div>

              <p style={styles.showing}>Mostrando {paginated.length} de {citas.length} servicios hoy</p>
            </div>
          </div>

        </div>
      </div>
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
  statusBadge:{display:'flex',alignItems:'center',gap:'8px',padding:'8px 16px',background:'#dcfce7',borderRadius:'20px',fontSize:'12px',fontWeight:700,color:'#166534'},
  dot:{width:'8px',height:'8px',background:'#16a34a',borderRadius:'50%',display:'inline-block'},
  resumenGrid:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'1.5rem'},
  resumenCard:{background:'#1e3a6e',borderRadius:'14px',padding:'1.2rem',display:'flex',alignItems:'center',gap:'14px'},
  resumenIcon:{fontSize:'28px'},
  resumenValue:{fontFamily:"'Sora',sans-serif",fontSize:'2rem',fontWeight:700,color:'#fff'},
  resumenLabel:{fontSize:'12px',color:'rgba(255,255,255,0.7)',marginTop:'2px'},
  twoCol:{display:'grid',gridTemplateColumns:'360px 1fr',gap:'1.5rem'},
  formSection:{background:'#fff',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'1.5rem'},
  sectionTitle:{fontFamily:"'Sora',sans-serif",fontSize:'1rem',fontWeight:600,color:'#0f1f3d',marginBottom:'1.2rem'},
  twoFields:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'},
  field:{marginBottom:'1rem'},
  label:{display:'block',fontSize:'12px',fontWeight:500,color:'#4a5568',marginBottom:'6px'},
  input:{width:'100%',padding:'10px 12px',border:'1px solid #dde3ec',borderRadius:'10px',fontSize:'14px',outline:'none',boxSizing:'border-box',fontFamily:"'DM Sans',sans-serif"},
  btnPrimary:{width:'100%',padding:'12px',background:'#1e3a6e',color:'#fff',border:'none',borderRadius:'10px',fontSize:'14px',fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif",marginTop:'0.5rem'},
  tableSection:{background:'#fff',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'1.5rem'},
  tableSectionHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'},
  tableIcons:{display:'flex',gap:'8px'},
  iconBtn:{background:'none',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'6px 10px',cursor:'pointer',fontSize:'14px'},
  tableWrap:{overflowX:'auto'},
  table:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'10px 12px',textAlign:'left',fontSize:'11px',fontWeight:600,color:'#8a96a8',textTransform:'uppercase',letterSpacing:'0.05em',borderBottom:'1px solid #e2e8f0'},
  tr:{borderBottom:'1px solid #f0f4f8'},
  td:{padding:'12px',fontSize:'13px',color:'#0f1f3d'},
  empty:{padding:'2rem',textAlign:'center',color:'#8a96a8',fontSize:'14px'},
  hora:{fontFamily:"'Sora',sans-serif",fontWeight:600,fontSize:'13px',color:'#1e3a6e'},
  staffCell:{display:'flex',flexDirection:'column'},
  staffName:{fontWeight:500,fontSize:'13px'},
  staffSub:{fontSize:'11px',color:'#8a96a8'},
  serviceCell:{display:'flex',flexDirection:'column'},
  serviceName:{fontWeight:500,fontSize:'13px'},
  vehicleText:{fontSize:'11px',color:'#8a96a8'},
  priceCell:{display:'flex',flexDirection:'column',gap:'4px'},
  price:{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'14px',color:'#0f1f3d'},
  estatusBadge:{padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:600,display:'inline-block'},
  pagination:{display:'flex',alignItems:'center',justifyContent:'center',gap:'6px',marginTop:'1rem'},
  pageBtn:{padding:'6px 12px',border:'1px solid #e2e8f0',borderRadius:'8px',background:'#fff',fontSize:'13px',cursor:'pointer',color:'#4a5568'},
  pageBtnActive:{background:'#1e3a6e',color:'#fff',border:'1px solid #1e3a6e'},
  showing:{fontSize:'12px',color:'#8a96a8',textAlign:'center',marginTop:'8px'},
}