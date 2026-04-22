import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/dashboard', label: 'Home', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { to: '/users', label: 'Users', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { to: '/services', label: 'Services', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
  { to: '/products', label: 'Products', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> },
  { to: '/vehicles', label: 'Vehículos', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="1" y="10" width="22" height="10" rx="2"/><path d="M5 10V7a7 7 0 0 1 14 0v3"/><circle cx="7.5" cy="17" r="1.5"/><circle cx="16.5" cy="17" r="1.5"/></svg> },
  { to: '/citas', label: 'Citas', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
            <rect x="1" y="10" width="22" height="10" rx="2"/>
            <path d="M5 10V7a7 7 0 0 1 14 0v3"/>
            <circle cx="7.5" cy="17" r="1.5" fill="#fff" stroke="none"/>
            <circle cx="16.5" cy="17" r="1.5" fill="#fff" stroke="none"/>
          </svg>
        </div>
        <div>
          <div style={styles.logoName}>CleanDrive</div>
          <div style={styles.logoSub}>Precision Management</div>
        </div>
      </div>

      <nav style={styles.nav}>
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.navLinkActive : {})
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div style={styles.bottom}>
        <button style={styles.supportBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Support
        </button>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Logout
        </button>
      </div>
    </div>
  )
}

const styles = {
  sidebar: { width:'220px', minHeight:'100vh', background:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', padding:'1.5rem 1rem', position:'fixed', top:0, left:0 },
  logo: { display:'flex', alignItems:'center', gap:'10px', marginBottom:'2rem', paddingBottom:'1rem', borderBottom:'1px dashed #e2e8f0' },
  logoIcon: { width:'38px', height:'38px', background:'#1e3a6e', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  logoName: { fontFamily:"'Sora', sans-serif", fontSize:'14px', fontWeight:600, color:'#0f1f3d' },
  logoSub: { fontSize:'10px', color:'#8a96a8', textTransform:'uppercase', letterSpacing:'0.05em' },
  nav: { display:'flex', flexDirection:'column', gap:'4px', flex:1 },
  navLink: { display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'10px', fontSize:'14px', color:'#4a5568', textDecoration:'none', fontFamily:"'DM Sans', sans-serif", transition:'all .2s' },
  navLinkActive: { background:'#eef2ff', color:'#1e3a6e', fontWeight:500 },
  bottom: { display:'flex', flexDirection:'column', gap:'4px', borderTop:'1px dashed #e2e8f0', paddingTop:'1rem' },
  supportBtn: { display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'10px', fontSize:'14px', color:'#4a5568', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans', sans-serif" },
  logoutBtn: { display:'flex', alignItems:'center', gap:'10px', padding:'9px 12px', borderRadius:'10px', fontSize:'14px', color:'#e53e3e', background:'none', border:'none', cursor:'pointer', fontFamily:"'DM Sans', sans-serif" },
}