/* ─────────────────── FLEXIBLE NUMBER INPUT COMPONENT WITH PRECISION IDR FORMATTING ─────────────────── */
(function() {
  const h = React.createElement;

  /* Helper to format number with IDR thousand dots: 40000 -> "40.000" */
  function formatIDRValue(val) {
    if (val === undefined || val === null || val === '') return '';
    const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/\./g, '').replace(/,/g, '.'));
    if (isNaN(num) || num === 0) return '';

    if (Number.isInteger(num)) {
      return new Intl.NumberFormat('id-ID').format(num);
    }
    return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(num);
  }

  window.FlexibleInput = function FlexibleInput({ value, onChange, className = '', prefix, suffix, placeholder, allowDecimal = false }) {
    const [isFocused, setIsFocused] = React.useState(false);
    const [localVal, setLocalVal] = React.useState(() => formatIDRValue(value));

    /* Sync when parent value changes externally */
    React.useEffect(() => {
      if (!isFocused) {
        setLocalVal(value === 0 || value === undefined || value === null ? '' : formatIDRValue(value));
      }
    }, [value, isFocused]);

    const handleBlur = () => {
      setIsFocused(false);
      if (!localVal) {
        onChange(0);
        setLocalVal('');
        return;
      }
      const cleanDigits = allowDecimal ? localVal.replace(/[^0-9,/.]/g, '').replace(/,/g, '.') : localVal.replace(/\D/g, '');
      const parsed = parseFloat(cleanDigits) || 0;
      onChange(parsed);
      setLocalVal(parsed === 0 ? '' : formatIDRValue(parsed));
    };

    const handleChange = (e) => {
      const inputStr = e.target.value;

      if (!inputStr) {
        setLocalVal('');
        onChange(0);
        return;
      }

      if (allowDecimal && (inputStr.includes(',') || inputStr.includes('.'))) {
        // Decimal typing mode
        const cleanDecimal = inputStr.replace(/[^0-9,/.]/g, '').replace(/\./g, ',');
        setLocalVal(cleanDecimal);
        const parsed = parseFloat(cleanDecimal.replace(/,/g, '.')) || 0;
        onChange(parsed);
      } else {
        // Pure integer money formatting mode (strips non-digits and formats automatically)
        const digitsOnly = inputStr.replace(/\D/g, '');
        if (!digitsOnly) {
          setLocalVal('');
          onChange(0);
          return;
        }

        const numVal = parseInt(digitsOnly, 10);
        const formatted = new Intl.NumberFormat('id-ID').format(numVal);
        setLocalVal(formatted);
        onChange(numVal);
      }
    };

    return h('div', { className: 'relative w-full' },
      prefix && h('span', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-xs font-extrabold text-slate-400 pointer-events-none' }, prefix),
      h('input', {
        type: 'text',
        inputMode: 'numeric',
        value: localVal,
        onChange: handleChange,
        onFocus: () => setIsFocused(true),
        onBlur: handleBlur,
        placeholder: placeholder || '0',
        className: `${prefix ? 'pl-8' : 'pl-3'} ${suffix ? 'pr-8' : 'pr-3'} ${className} w-full border border-slate-300 rounded-xl text-xs font-bold bg-white text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition py-2 font-mono`
      }),
      suffix && h('span', { className: 'absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 pointer-events-none' }, suffix)
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
