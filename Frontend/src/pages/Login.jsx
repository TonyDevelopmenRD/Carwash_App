import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [reg, setReg] = useState({
    username: '', email: '', password: '', confirm: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', {
        email: form.email,
        password: form.password
      })
      localStorage.setItem('token', res.data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (reg.password !== reg.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    try {
      await api.post('/auth/register', {
        username: reg.username,
        email: reg.email,
        password: reg.password,
        role_id: 1
      })
      setShowModal(false)
      setError('')
      alert('Usuario registrado correctamente')
    } catch (err) {
      setError('Error al registrar usuario')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoBox}>
          <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round">
            <rect x="1" y="10" width="22" height="10" rx="2"/>
            <path d="M5 10V7a7 7 0 0 1 14 0v3"/>
            <circle cx="7.5" cy="17" r="1.5" fill="#fff" stroke="none"/>
            <circle cx="16.5" cy="17" r="1.5" fill="#fff" stroke="none"/>
          </svg>
        </div>

        <h1 style={styles.title}>Inicio de sesión</h1>
        <p style={styles.subtitle}>Bienvenido a CleanDrive Precision Management</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin}>
          <div style={styles.field}>
            <label style={styles.label}>Correo electrónico</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#8a96a8" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>
              <input
                style={styles.input}
                type="email"
                placeholder="ejemplo@correo.com"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <div style={styles.inputWrap}>
              <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#8a96a8" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <input
                style={styles.input}
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
              <svg onClick={() => setShowPwd(!showPwd)} style={styles.eyeIcon} viewBox="0 0 24 24" fill="none" stroke="#8a96a8" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
            <div style={styles.forgot}><a href="#" style={styles.forgotLink}>¿Olvidaste tu contraseña?</a></div>
          </div>

          <button type="submit" style={styles.btnPrimary} disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar sesión →'}
          </button>
        </form>

        <div style={styles.divider}><span>o</span></div>

        <button style={styles.btnSecondary} onClick={() => setShowModal(true)}>
          + Registrar nuevo usuario
        </button>
      </div>

      {/* Modal Registro */}
      {showModal && (
        <div style={styles.overlay} onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Registro de Usuario</h2>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRegister}>
              {[
                { label: 'Nombre de usuario', key: 'username', placeholder: 'Ej. juan123' },
                { label: 'Correo Electrónico', key: 'email', placeholder: 'usuario@carwash.com', type: 'email' },
                { label: 'Contraseña', key: 'password', placeholder: '••••••••', type: 'password' },
                { label: 'Confirmar Contraseña', key: 'confirm', placeholder: '••••••••', type: 'password' },
              ].map(f => (
                <div key={f.key} style={styles.field}>
                  <label style={styles.label}>{f.label}</label>
                  <input
                    style={{...styles.input, paddingLeft: '12px'}}
                    type={f.type || 'text'}
                    placeholder={f.placeholder}
                    value={reg[f.key]}
                    onChange={e => setReg({...reg, [f.key]: e.target.value})}
                    required
                  />
                </div>
              ))}
              <button type="submit" style={styles.btnPrimary}>Registrar</button>
              <button type="button" style={{...styles.btnSecondary, marginTop: '8px'}} onClick={() => setShowModal(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { minHeight:'100vh', background:'#f0f4f8', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans', sans-serif" },
  card: { background:'#fff', borderRadius:'20px', padding:'2.5rem 2.2rem', width:'100%', maxWidth:'400px', border:'1px solid #e2e8f0' },
  logoBox: { width:'72px', height:'72px', background:'#1e3a6e', borderRadius:'18px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 1.2rem' },
  title: { fontFamily:"'Sora', sans-serif", fontSize:'1.5rem', fontWeight:600, color:'#0f1f3d', textAlign:'center', marginBottom:'0.25rem' },
  subtitle: { fontSize:'13px', color:'#8a96a8', textAlign:'center', marginBottom:'1.8rem' },
  error: { background:'#fee2e2', color:'#991b1b', padding:'10px 14px', borderRadius:'10px', fontSize:'13px', marginBottom:'1rem' },
  field: { marginBottom:'1rem' },
  label: { display:'block', fontSize:'12px', fontWeight:500, color:'#4a5568', marginBottom:'6px' },
  inputWrap: { position:'relative', display:'flex', alignItems:'center' },
  inputIcon: { position:'absolute', left:'12px', width:'16px', height:'16px' },
  input: { width:'100%', padding:'10px 12px 10px 38px', border:'1px solid #dde3ec', borderRadius:'10px', fontSize:'14px', color:'#0f1f3d', background:'#f8fafc', outline:'none', boxSizing:'border-box' },
  eyeIcon: { position:'absolute', right:'12px', width:'16px', height:'16px', cursor:'pointer' },
  forgot: { textAlign:'right', marginTop:'4px' },
  forgotLink: { fontSize:'12px', color:'#1e3a6e', textDecoration:'none', fontWeight:500 },
  btnPrimary: { width:'100%', padding:'12px', background:'#1e3a6e', color:'#fff', border:'none', borderRadius:'10px', fontSize:'14px', fontWeight:600, cursor:'pointer', marginTop:'1rem' },
  btnSecondary: { width:'100%', padding:'11px', background:'#fff', color:'#1e3a6e', border:'1.5px solid #1e3a6e', borderRadius:'10px', fontSize:'14px', cursor:'pointer' },
  divider: { textAlign:'center', color:'#c0c8d4', fontSize:'12px', margin:'1.2rem 0' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 },
  modal: { background:'#fff', borderRadius:'18px', padding:'2rem', width:'100%', maxWidth:'420px', maxHeight:'90vh', overflowY:'auto' },
  modalHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' },
  modalTitle: { fontFamily:"'Sora', sans-serif", fontSize:'1.1rem', fontWeight:600, color:'#0f1f3d' },
  closeBtn: { background:'none', border:'none', cursor:'pointer', fontSize:'16px', color:'#8a96a8' },
}