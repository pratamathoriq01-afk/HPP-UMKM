/* ─────────────────── FLEXIBLE NUMBER INPUT COMPONENT ─────────────────── */
(function() {
  const h = React.createElement;

  window.FlexibleInput = function FlexibleInput({ value, onChange, className = '', prefix, suffix, placeholder }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [localVal, setLocalVal] = React.useState(String(value || ''));

    React.useEffect(() => {
      if (!isFocused) {
        setLocalVal(value === 0 ? '' : String(value));
      }
    }, [value, isFocused]);

    const handleBlur = () => {
      setIsFocused(false);
      const parsed = parseFloat(localVal) || 0;
      onChange(parsed);
    };

    const handleChange = (e) => {
      const val = e.target.value;
      if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
        setLocalVal(val);
        const parsed = parseFloat(val);
        if (!isNaN(parsed)) {
          onChange(parsed);
        } else {
          onChange(0);
        }
      }
    };

    return h('div', { className: 'relative w-full' },
      prefix && h('span', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none' }, prefix),
      h('input', {
        type: 'text',
        value: localVal,
        onChange: handleChange,
        onFocus: () => setIsFocused(true),
        onBlur: handleBlur,
        placeholder: placeholder || '0',
        className: `${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} ${className} w-full border border-slate-200 rounded-lg text-sm bg-white text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-1.5`
      }),
      suffix && h('span', { className: 'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 pointer-events-none' }, suffix)
    );
  };

  /* Mini Tooltip Component */
  window.Tip = function Tip({ text }) {
    const [show, setShow] = React.useState(false);
    return h('span', {
      className: 'relative inline-block align-middle cursor-pointer text-slate-400 hover:text-indigo-600 ml-1.5',
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false)
    },
      h('svg', { width: 12, height: 12, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round' },
        h('circle', { cx: 12, cy: 12, r: 10 }),
        h('line', { x1: 12, y1: 16, x2: 12, y2: 12 }),
        h('line', { x1: 12, y1: 8, x2: 12.01, y2: 8 })
      ),
      show && h('span', { className: 'absolute z-50 bottom-6 left-1/2 -translate-x-1/2 w-64 bg-slate-900 text-white text-[11px] leading-relaxed rounded-lg p-3 shadow-xl pointer-events-none font-normal' }, text)
    );
  };
})();
