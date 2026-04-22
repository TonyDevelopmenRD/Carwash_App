export default function Topbar({ title, subtitle }) {
  const user = JSON.parse(localStorage.getItem('user') || '{"nombre":"Admin","role":"Manager"}')

  return (
    <div style={styles.topbar}>
      <div style={styles.search}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#8a96a8" strokeWidth="2" width="16" height="16"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input style={styles.searchInput} type="text" placeholder="Buscar..."/>
      </div>
      <div style={styles.right}>
        <button style={styles.iconBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" width="18" height="18"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </button>
        <button style={styles.iconBtn}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#4a5568" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </button>
        <div style={styles.userInfo}>
          <div style={styles.userText}>
            <span style={styles.userName}>{user.nombre}</span>
            <span style={styles.userRole}>{user.role}</span>
          </div>
          <div style={styles.avatar}>
            {user.nombre?.charAt(0)}{user.apellido?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  topbar: { height:'60px', background:'#fff', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 1.5rem', position:'fixed', top:0, left:'220px', right:0, zIndex:10 },
  search: { display:'flex', alignItems:'center', gap:'8px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px', padding:'8px 14px', width:'320px' },
  searchInput: { border:'none', background:'none', outline:'none', fontSize:'14px', color:'#0f1f3d', width:'100%', fontFamily:"'DM Sans', sans-serif" },
  right: { display:'flex', alignItems:'center', gap:'8px' },
  iconBtn: { width:'36px', height:'36px', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'8px' },
  userInfo: { display:'flex', alignItems:'center', gap:'10px', marginLeft:'8px' },
  userText: { display:'flex', flexDirection:'column', alignItems:'flex-end' },
  userName: { fontSize:'13px', fontWeight:500, color:'#0f1f3d', fontFamily:"'Sora', sans-serif" },
  userRole: { fontSize:'11px', color:'#8a96a8' },
  avatar: { width:'36px', height:'36px', background:'#1e3a6e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:600, color:'#fff', fontFamily:"'Sora', sans-serif" },
}