import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const normalizeOptions = options => options.map(option => (
  typeof option === 'string' ? { value: option, label: option } : option
));

export function CustomSelect({ value, options = [], onChange, className = '', disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const items = normalizeOptions(options);
  const selected = items.find(item => item.value === value) || items[0];

  useEffect(() => {
    const close = event => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const select = item => {
    if (item.disabled) return;
    onChange?.(item.value);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`custom-select ${className} ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
      <button type="button" className="custom-select-trigger" disabled={disabled} onClick={() => setOpen(v => !v)}>
        <span>{selected?.label || 'Select'}</span>
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="custom-select-menu">
          {items.map(item => (
            <button
              type="button"
              key={item.value}
              className={`custom-select-option ${item.value === value ? 'selected' : ''}`}
              disabled={item.disabled}
              onClick={() => select(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
