import { AlertTriangle, Trash2, X } from 'lucide-react';

export function ConfirmDeleteDialog({
  open,
  title = 'Delete item',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="confirm-bg" onClick={event => event.target === event.currentTarget && !loading && onCancel?.()}>
      <div className="confirm-box" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
        <button type="button" className="confirm-close" onClick={onCancel} disabled={loading} aria-label="Close">
          <X size={16} />
        </button>
        <div className="confirm-icon">
          <AlertTriangle size={24} />
        </div>
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            <Trash2 size={14} />
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
      <style>{`
        .confirm-bg{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(0,0,0,.72);backdrop-filter:blur(5px)}
        .confirm-box{position:relative;width:min(440px,100%);padding:26px 24px 22px;border-radius:18px;background:#141414;border:1px solid rgba(255,255,255,.10);box-shadow:0 24px 70px rgba(0,0,0,.55);text-align:center}
        .confirm-close{position:absolute;top:14px;right:14px;width:30px;height:30px;border:0;border-radius:8px;background:rgba(255,255,255,.06);color:rgba(255,255,255,.46);display:flex;align-items:center;justify-content:center;cursor:pointer}
        .confirm-close:hover{background:rgba(255,255,255,.10);color:#fff}
        .confirm-close:disabled{opacity:.45;cursor:not-allowed}
        .confirm-icon{width:58px;height:58px;margin:0 auto 16px;border-radius:18px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.22);color:#f87171;display:flex;align-items:center;justify-content:center}
        .confirm-box h3{margin:0 0 8px;color:#f5f5f5;font-size:18px;font-weight:800;font-family:'Sora',sans-serif}
        .confirm-box p{margin:0 auto 22px;max-width:340px;color:rgba(255,255,255,.52);font-size:13px;line-height:1.6}
        .confirm-actions{display:flex;justify-content:center;gap:10px}
        .confirm-actions .btn{min-width:112px;justify-content:center}
        @media(max-width:520px){.confirm-actions{flex-direction:column-reverse}.confirm-actions .btn{width:100%}}
      `}</style>
    </div>
  );
}
