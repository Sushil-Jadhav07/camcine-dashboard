import { useState, useEffect } from 'react';
import { AlertCircle, Search, Plus, Edit2, Trash2, Mail, Shield, CheckCircle, XCircle, ChevronLeft, ChevronRight, X, Users as UsersIcon, Eye, EyeOff, Lock, UserPlus } from 'lucide-react';
import { userService } from '../services/users.js';
import { authService } from '../services/auth.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { UserRole } from '../constants/sections';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { buildRegisterPayload, buildUserUpdatePayload, normalizeUsersFromApi, mapRoleToApi } from '../services/roleMapper.js';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog.jsx';

const roleLabels = { [UserRole.ADMIN]:'Admin', [UserRole.MANAGER]:'Manager', [UserRole.USER]:'Viewer', [UserRole.ACTOR]:'Actor' };
const roleBadge  = { [UserRole.ADMIN]:'b-accent', [UserRole.MANAGER]:'b-yellow', [UserRole.USER]:'b-blue', [UserRole.ACTOR]:'b-purple' };
const roleFilters = ['All','Admin','Manager','User','Actor'];
const roleOptions = Object.values(UserRole).map(role => ({ value: role, label: roleLabels[role] || role }));

const emptyRegForm = { first_name:'', last_name:'', email:'', phone_number:'', password:'', confirm_password:'', role: UserRole.USER, age:'' };
const emptyEditForm = { first_name:'', last_name:'', phone_number:'', age:'', role: UserRole.USER };

export function UsersSection() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page:1, total:0, total_pages:1 });
  const [q, setQ] = useState('');
  const [selRole, setSelRole] = useState('All');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register modal (admin-only, calls /auth/register)
  const [showRegister, setShowRegister] = useState(false);
  const [regForm, setRegForm] = useState(emptyRegForm);
  const [showPw, setShowPw] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState(null);
  const [regSuccess, setRegSuccess] = useState('');

  // Edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [deactivateTarget, setDeactivateTarget] = useState(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const PER = 10;
  const canManage = currentUser?.role === UserRole.ADMIN;

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => { fetchUsers(); }, [page, q, selRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true); setError(null);
      const params = { page, limit: PER };
      if (q) params.search = q;
      if (selRole !== 'All') params.role = mapRoleToApi(selRole.toLowerCase());
      const r = await userService.getAllUsers(params);
      if (r.success) {
        const raw = r.data?.users || r.data || [];
        setUsers(normalizeUsersFromApi(raw));
        setPagination(r.data?.pagination || { page:1, total: raw.length, total_pages:1 });
      }
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // Register
  const openRegister = () => { setRegForm(emptyRegForm); setRegError(null); setRegSuccess(''); setShowRegister(true); };
  const closeRegister = () => { setShowRegister(false); setRegError(null); setRegSuccess(''); };
  const setReg = (k, v) => setRegForm(p => ({...p,[k]:v}));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm_password) { setRegError('Passwords do not match'); return; }
    try {
      setRegLoading(true); setRegError(null);
      const payload = buildRegisterPayload(regForm);
      const r = await authService.register(payload);
      if (r.success) {
        setRegSuccess(`User "${regForm.first_name} ${regForm.last_name}" registered successfully!`);
        setTimeout(() => { closeRegister(); fetchUsers(); }, 1800);
      }
    } catch(e) { setRegError(e.message || 'Registration failed'); }
    finally { setRegLoading(false); }
  };

  // Edit
  const openEdit = (u) => {
    setEditTarget(u);
    setEditForm({ first_name:u.first_name||'', last_name:u.last_name||'', phone_number:u.phone_number||'', age:u.age||'', role:u.role||UserRole.USER });
    setEditError(null);
    setShowEdit(true);
  };
  const closeEdit = () => { setShowEdit(false); setEditTarget(null); setEditError(null); };
  const setEd = (k, v) => setEditForm(p => ({...p,[k]:v}));

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      setEditLoading(true); setEditError(null);
      const payload = buildUserUpdatePayload(editForm);
      const r = await userService.updateUser(editTarget.id, payload);
      if (r.success) { closeEdit(); fetchUsers(); }
    } catch(e) { setEditError(e.message || 'Update failed'); }
    finally { setEditLoading(false); }
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    try {
      setDeactivateLoading(true);
      const r = await userService.deactivateUser(deactivateTarget.id);
      setDeactivateTarget(null);
      if (r.success) {
        setUsers(prev => prev.map(user => (
          user.id === deactivateTarget.id ? { ...user, is_active: false } : user
        )));
        fetchUsers();
      }
    } catch(e) { setError(e.message); }
    finally { setDeactivateLoading(false); }
  };

  const initials = u => `${u.first_name?.[0]||''}${u.last_name?.[0]||''}`.toUpperCase() || '?';

  // Search debounce
  const [searchTimer, setSearchTimer] = useState(null);
  const handleSearch = (val) => {
    if (searchTimer) clearTimeout(searchTimer);
    setSearchTimer(setTimeout(() => { setQ(val); setPage(1); }, 400));
  };

  return (
    <div className={`page ${visible?'visible':''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left"><h1>Users</h1><p>{pagination.total} total accounts</p></div>
          <div className="ph-right">
            {canManage && (
              <button className="btn btn-primary" onClick={openRegister}>
                <UserPlus size={15}/>Register New User
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            {label:'Total Users', value:pagination.total, icon:UsersIcon},
            {label:'Active',      value:users.filter(u=>u.is_active).length, icon:CheckCircle},
            {label:'Admins',      value:users.filter(u=>u.role===UserRole.ADMIN).length, icon:Shield},
            {label:'Inactive',    value:users.filter(u=>!u.is_active).length, icon:XCircle},
          ].map(({label,value,icon:Icon},i) => (
            <div key={i} className="sc">
              <div className="sc-icon"><Icon size={20}/></div>
              <div><div className="sc-label">{label}</div><div className="sc-value">{value}</div></div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="fbar">
          <div className="fsearch" style={{flex:1}}>
            <Search size={15} style={{color:'rgba(255,255,255,.30)',flexShrink:0}}/>
            <input placeholder="Search by name or email..." onChange={e => handleSearch(e.target.value)}/>
          </div>
          <CustomSelect value={selRole} onChange={value => { setSelRole(value); setPage(1); }} options={roleFilters} />
        </div>

        {error && (
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'11px 14px',background:'rgba(239,68,68,.08)',border:'1px solid rgba(239,68,68,.18)',borderRadius:10,fontSize:13,color:'#fca5a5',marginBottom:12}}>
            <AlertCircle size={14}/>{error}
          </div>
        )}

        {/* Table */}
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>User</th><th>Role</th><th>Status</th><th>Phone</th><th>Age</th>
                {canManage && <th style={{textAlign:'right'}}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}><div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,padding:'32px',color:'rgba(255,255,255,.35)'}}><div className="spin"/>Loading users…</div></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6}><div className="empty"><UsersIcon size={32}/><p>No users found</p></div></td></tr>
              ) : users.map(u => {
                const isCurrentUser = currentUser?.id === u.id;
                const canDeactivate = u.is_active && !isCurrentUser;
                return (
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div className="avatar">{initials(u)}</div>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'#f5f5f5'}}>{u.first_name} {u.last_name}</div>
                        <div style={{fontSize:12,color:'rgba(255,255,255,.38)',display:'flex',alignItems:'center',gap:4}}><Mail size={11}/>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className={`badge ${roleBadge[u.role]||'b-gray'}`}>{roleLabels[u.role]||u.role}</span></td>
                  <td><span className={`badge ${u.is_active?'b-green':'b-gray'}`}>{u.is_active?'Active':'Inactive'}</span></td>
                  <td style={{color:'rgba(255,255,255,.55)',fontSize:13}}>{u.phone_number||'—'}</td>
                  <td style={{color:'rgba(255,255,255,.55)',fontSize:13}}>{u.age||'—'}</td>
                  {canManage && (
                    <td>
                      <div style={{display:'flex',justifyContent:'flex-end',gap:6}}>
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(u)} title="Edit"><Edit2 size={14}/></button>
                        <button
                          className="btn btn-danger btn-icon"
                          onClick={() => setDeactivateTarget({ id: u.id, name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email || 'This user' })}
                          title={isCurrentUser ? 'You cannot deactivate your own account' : u.is_active ? 'Deactivate' : 'User already inactive'}
                          disabled={!canDeactivate}
                        >
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:16}}>
            <span className="pgn-info">Page {page} of {pagination.total_pages} ({pagination.total} users)</span>
            <div className="pgn">
              <button className="btn btn-secondary btn-sm" disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={14}/></button>
              <button className="btn btn-secondary btn-sm" disabled={page===pagination.total_pages} onClick={()=>setPage(p=>p+1)}><ChevronRight size={14}/></button>
            </div>
          </div>
        )}
      </div>

      {/* REGISTER MODAL */}
      {showRegister && (
        <div className="modal-bg" onClick={e => e.target===e.currentTarget && closeRegister()}>
          <div className="modal-box" style={{maxWidth:520}}>
            <div className="modal-hdr">
              <h3 style={{display:'flex',alignItems:'center',gap:8}}><UserPlus size={18}/>Register New User</h3>
              <button className="modal-close" onClick={closeRegister}><X size={15}/></button>
            </div>
            {regSuccess ? (
              <div style={{padding:'28px 0',textAlign:'center'}}>
                <CheckCircle size={40} style={{color:'#4ade80',margin:'0 auto 14px'}}/>
                <div style={{fontSize:15,fontWeight:700,color:'#f5f5f5'}}>{regSuccess}</div>
              </div>
            ) : (
              <form onSubmit={handleRegister}>
                <div className="form-grid-2" style={{marginBottom:14}}>
                  <div className="fg"><label className="lbl">First Name *</label><input className="inp" value={regForm.first_name} onChange={e=>setReg('first_name',e.target.value)} required/></div>
                  <div className="fg"><label className="lbl">Last Name *</label><input className="inp" value={regForm.last_name} onChange={e=>setReg('last_name',e.target.value)} required/></div>
                </div>
                <div className="fg" style={{marginBottom:14}}>
                  <label className="lbl">Email *</label>
                  <input type="email" className="inp" value={regForm.email} onChange={e=>setReg('email',e.target.value)} required/>
                </div>
                <div className="form-grid-2" style={{marginBottom:14}}>
                  <div className="fg"><label className="lbl">Phone</label><input className="inp" value={regForm.phone_number} onChange={e=>setReg('phone_number',e.target.value)} placeholder="+91 98765..."/></div>
                  <div className="fg"><label className="lbl">Age</label><input type="number" className="inp" min="13" max="120" value={regForm.age} onChange={e=>setReg('age',e.target.value)}/></div>
                </div>
                <div className="fg" style={{marginBottom:14}}>
                  <label className="lbl">Role *</label>
                  <CustomSelect className="inp" value={regForm.role} onChange={value => setReg('role', value)} options={roleOptions} />
                </div>
                <div className="form-grid-2" style={{marginBottom:14}}>
                  <div className="fg">
                    <label className="lbl">Password *</label>
                    <div style={{position:'relative',display:'flex',alignItems:'center'}}>
                      <Lock size={14} style={{position:'absolute',left:12,color:'rgba(255,255,255,.25)',pointerEvents:'none'}}/>
                      <input type={showPw?'text':'password'} className="inp" style={{paddingLeft:36,paddingRight:36}} value={regForm.password} onChange={e=>setReg('password',e.target.value)} required minLength={6}/>
                      <button type="button" onClick={()=>setShowPw(o=>!o)} style={{position:'absolute',right:10,background:'none',border:'none',color:'rgba(255,255,255,.28)',cursor:'pointer',padding:4}}>
                        {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                      </button>
                    </div>
                  </div>
                  <div className="fg">
                    <label className="lbl">Confirm Password *</label>
                    <div style={{position:'relative',display:'flex',alignItems:'center'}}>
                      <Lock size={14} style={{position:'absolute',left:12,color:'rgba(255,255,255,.25)',pointerEvents:'none'}}/>
                      <input type={showPw?'text':'password'} className="inp" style={{paddingLeft:36}} value={regForm.confirm_password} onChange={e=>setReg('confirm_password',e.target.value)} required/>
                    </div>
                  </div>
                </div>
                {regError && (
                  <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.15)',borderRadius:9,color:'#fca5a5',fontSize:13,marginBottom:14}}>
                    <AlertCircle size={13}/>{regError}
                  </div>
                )}
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeRegister}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={regLoading}>
                    {regLoading ? <><span className="spin-sm"/>Registering…</> : <><UserPlus size={14}/>Register User</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEdit && editTarget && (
        <div className="modal-bg" onClick={e => e.target===e.currentTarget && closeEdit()}>
          <div className="modal-box">
            <div className="modal-hdr">
              <h3>Edit User — {editTarget.first_name} {editTarget.last_name}</h3>
              <button className="modal-close" onClick={closeEdit}><X size={15}/></button>
            </div>
            <form onSubmit={handleEdit}>
              <div className="form-grid-2" style={{marginBottom:14}}>
                <div className="fg"><label className="lbl">First Name</label><input className="inp" value={editForm.first_name} onChange={e=>setEd('first_name',e.target.value)} required/></div>
                <div className="fg"><label className="lbl">Last Name</label><input className="inp" value={editForm.last_name} onChange={e=>setEd('last_name',e.target.value)} required/></div>
              </div>
              <div className="form-grid-2" style={{marginBottom:14}}>
                <div className="fg"><label className="lbl">Phone</label><input className="inp" value={editForm.phone_number} onChange={e=>setEd('phone_number',e.target.value)}/></div>
                <div className="fg"><label className="lbl">Age</label><input type="number" className="inp" value={editForm.age} onChange={e=>setEd('age',e.target.value)}/></div>
              </div>
              <div className="fg" style={{marginBottom:14}}>
                <label className="lbl">Role</label>
                <CustomSelect className="inp" value={editForm.role} onChange={value => setEd('role', value)} options={roleOptions} />
              </div>
              {editError && (
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.15)',borderRadius:9,color:'#fca5a5',fontSize:13,marginBottom:14}}>
                  <AlertCircle size={13}/>{editError}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={editLoading}>
                  {editLoading ? <><span className="spin-sm"/>Saving…</> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deactivateTarget}
        title="Deactivate user?"
        message={`${deactivateTarget?.name || 'This user'} will no longer be able to log in.`}
        confirmLabel="Deactivate"
        loading={deactivateLoading}
        onCancel={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
      />

      <style>{`
        ${PAGE_STYLES}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin-sm{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.20);border-top-color:#fff;animation:spin .65s linear infinite;flex-shrink:0}
      `}</style>
    </div>
  );
}
