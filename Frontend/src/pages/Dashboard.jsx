import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import api from '../services/api'

export default function Dashboard() {
  const [stats, setStats] = useState({
    usuarios: 0, servicios: 0, productos: 0, vehiculos: 0,
    citas_hoy: 0, ingresos_hoy: 0, en_lavado: 0, completados: 0
  })
  const [citasRecientes, setCitasRecientes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])

  const fetchStats = async () => {
    try {
      // Por esto:
      const [users, services, products, vehicles, citas] = await Promise.allSettled([
        api.get('/users/'),
        api.get('/services/'),
        api.get('/products/'),
        api.get('/vehicles/'),   // ✅
      ])

      const u = users.status === 'fulfilled' ? users.value.data : []
      const s = services.status === 'fulfilled' ? services.value.data : []
      const p = products.status === 'fulfilled' ? products.value.data : []
      const v = vehicles.status === 'fulfilled' ? vehicles.value.data : []
      const c = citas.status === 'fulfilled' ? citas.value.data : []

      const hoy = new Date().toISOString().split('T')[0]
      const citasHoy = c.filter(x => x.fecha === hoy)

      setStats({
        usuarios: u.length,
        servicios: s.length,
        productos: p.length,
        vehiculos: v.length,
        citas_hoy: citasHoy.length,
        ingresos_hoy: citasHoy.reduce((acc, x) => acc + (x.precio_final || 0), 0),
        en_lavado: v.filter(x => x.estatus === 'En Lavado').length,
        completados: c.filter(x => x.estatus === 'Completado').length,
      })
      setCitasRecientes(c.slice(0, 5))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const estatusStyle = (e) => ({
    'En Cola':    { bg:'#fef3c7', color:'#92400e' },
    'En Proceso': { bg:'#dbeafe', color:'#1e40af' },
    'Completado': { bg:'#dcfce7', color:'#166534' },
    'Cancelado':  { bg:'#fee2e2', color:'#991b1b' },
  }[e] || { bg:'#f1f5f9', color:'#334155' })

  const kpis = [
    { label:'Usuarios', value: stats.usuarios, icon:'👥', color:'#1e3a6e', sub:'Personal registrado' },
    { label:'Servicios', value: stats.servicios, icon:'✨', color:'#0f766e', sub:'En catálogo' },
    { label:'Vehículos', value: stats.vehiculos, icon:'🚗', color:'#7c3aed', sub:'Registrados' },
    { label:'Productos', value: stats.productos, icon:'📦', color:'#b45309', sub:'En inventario' },
  ]

  const operacional = [
    { label:'Citas Hoy', value: stats.citas_hoy, icon:'📅', bg:'#dbeafe', color:'#1e40af' },
    { label:'En Lavado', value: stats.en_lavado, icon:'🚿', bg:'#fef3c7', color:'#92400e' },
    { label:'Completados', value: stats.completados, icon:'✅', bg:'#dcfce7', color:'#166534' },
    { label:'Ingresos Hoy', value: `$${stats.ingresos_hoy.toFixed(2)}`, icon:'💰', bg:'#f3e8ff', color:'#7c3aed' },
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
              <h1 style={styles.pageTitle}>Dashboard</h1>
              <p style={styles.pageSubtitle}>Bienvenido de vuelta. Aquí está el resumen de hoy.</p>
            </div>
            <div style={styles.dateBadge}>
              📅 {new Date().toLocaleDateString('es-MX', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </div>
          </div>

          {/* KPIs principales */}
          <div style={styles.kpiGrid}>
            {kpis.map(k => (
              <div key={k.label} style={{...styles.kpiCard, borderTop:`4px solid ${k.color}`}}>
                <div style={styles.kpiTop}>
                  <span style={styles.kpiIcon}>{k.icon}</span>
                  <span style={{...styles.kpiValue, color: k.color}}>{loading ? '...' : k.value}</span>
                </div>
                <div style={styles.kpiLabel}>{k.label}</div>
                <div style={styles.kpiSub}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Operacional */}
          <div style={styles.opGrid}>
            {operacional.map(o => (
              <div key={o.label} style={{...styles.opCard, background: o.bg}}>
                <div style={styles.opIcon}>{o.icon}</div>
                <div style={{...styles.opValue, color: o.color}}>{loading ? '...' : o.value}</div>
                <div style={{...styles.opLabel, color: o.color}}>{o.label}</div>
              </div>
            ))}
          </div>

          <div style={styles.twoCol}>
            {/* Citas recientes */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Citas Recientes</h3>
                <a href="/citas" style={styles.verTodo}>Ver todo →</a>
              </div>
              {loading ? (
                <p style={styles.empty}>Cargando...</p>
              ) : citasRecientes.length === 0 ? (
                <p style={styles.empty}>No hay citas registradas</p>
              ) : citasRecientes.map(c => (
                <div key={c.id} style={styles.citaRow}>
                  <div style={styles.citaLeft}>
                    <div style={styles.citaHora}>{c.hora || '--:--'}</div>
                    <div>
                      <div style={styles.citaServicio}>{c.servicio}</div>
                      <div style={styles.citaVehiculo}>{c.vehiculo}</div>
                    </div>
                  </div>
                  <div style={styles.citaRight}>
                    <span style={styles.citaPrecio}>${c.precio_final || '0.00'}</span>
                    <span style={{
                      ...styles.estatusBadge,
                      background: estatusStyle(c.estatus).bg,
                      color: estatusStyle(c.estatus).color
                    }}>{c.estatus}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Accesos rápidos */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Accesos Rápidos</h3>
              </div>
              <div style={styles.quickGrid}>
                {[
                  { label:'Nueva Cita', icon:'📅', href:'/citas', color:'#1e3a6e' },
                  { label:'Nuevo Usuario', icon:'👤', href:'/users', color:'#0f766e' },
                  { label:'Nuevo Servicio', icon:'✨', href:'/services', color:'#7c3aed' },
                  { label:'Nuevo Producto', icon:'📦', href:'/products', color:'#b45309' },
                  { label:'Agregar Vehículo', icon:'🚗', href:'/vehicles', color:'#be123c' },
                  { label:'Ver Reportes', icon:'📊', href:'#', color:'#0369a1' },
                ].map(q => (
                  <a key={q.label} href={q.href} style={{...styles.quickCard, borderLeft:`4px solid ${q.color}`}}>
                    <span style={styles.quickIcon}>{q.icon}</span>
                    <span style={styles.quickLabel}>{q.label}</span>
                  </a>
                ))}
              </div>

              {/* Estado del sistema */}
              <div style={styles.systemStatus}>
                <div style={styles.systemDot}/>
                <div>
                  <div style={styles.systemTitle}>Estado del Sistema</div>
                  <div style={styles.systemSub}>Sincronización activa — EN LÍNEA</div>
                </div>
              </div>
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
  dateBadge:{padding:'8px 16px',background:'#fff',borderRadius:'10px',border:'1px solid #e2e8f0',fontSize:'13px',color:'#4a5568'},
  kpiGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1rem'},
  kpiCard:{background:'#fff',borderRadius:'14px',border:'1px solid #e2e8f0',padding:'1.25rem'},
  kpiTop:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px'},
  kpiIcon:{fontSize:'24px'},
  kpiValue:{fontFamily:"'Sora',sans-serif",fontSize:'2rem',fontWeight:700},
  kpiLabel:{fontSize:'14px',fontWeight:500,color:'#0f1f3d'},
  kpiSub:{fontSize:'12px',color:'#8a96a8',marginTop:'2px'},
  opGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem',marginBottom:'1.5rem'},
  opCard:{borderRadius:'14px',padding:'1.25rem',display:'flex',flexDirection:'column',alignItems:'center',gap:'6px'},
  opIcon:{fontSize:'28px'},
  opValue:{fontFamily:"'Sora',sans-serif",fontSize:'1.8rem',fontWeight:700},
  opLabel:{fontSize:'12px',fontWeight:600,letterSpacing:'0.03em'},
  twoCol:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'},
  card:{background:'#fff',borderRadius:'16px',border:'1px solid #e2e8f0',padding:'1.5rem'},
  cardHeader:{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1.2rem'},
  cardTitle:{fontFamily:"'Sora',sans-serif",fontSize:'1rem',fontWeight:600,color:'#0f1f3d'},
  verTodo:{fontSize:'13px',color:'#1e3a6e',textDecoration:'none',fontWeight:500},
  citaRow:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid #f0f4f8'},
  citaLeft:{display:'flex',alignItems:'center',gap:'12px'},
  citaHora:{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'13px',color:'#1e3a6e',minWidth:'50px'},
  citaServicio:{fontSize:'13px',fontWeight:500,color:'#0f1f3d'},
  citaVehiculo:{fontSize:'11px',color:'#8a96a8'},
  citaRight:{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:'4px'},
  citaPrecio:{fontFamily:"'Sora',sans-serif",fontWeight:700,fontSize:'14px',color:'#0f1f3d'},
  estatusBadge:{padding:'3px 8px',borderRadius:'6px',fontSize:'11px',fontWeight:600},
  empty:{color:'#8a96a8',fontSize:'14px',textAlign:'center',padding:'1rem'},
  quickGrid:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px',marginBottom:'1.2rem'},
  quickCard:{display:'flex',alignItems:'center',gap:'10px',padding:'10px 12px',background:'#f8fafc',borderRadius:'10px',textDecoration:'none',transition:'background .2s'},
  quickIcon:{fontSize:'18px'},
  quickLabel:{fontSize:'13px',fontWeight:500,color:'#0f1f3d'},
  systemStatus:{display:'flex',alignItems:'center',gap:'12px',padding:'12px',background:'#f0fdf4',borderRadius:'10px',border:'1px solid #bbf7d0'},
  systemDot:{width:'10px',height:'10px',background:'#16a34a',borderRadius:'50%',flexShrink:0},
  systemTitle:{fontSize:'13px',fontWeight:600,color:'#166534'},
  systemSub:{fontSize:'11px',color:'#16a34a'},
}