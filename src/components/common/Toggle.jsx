function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-[#14453a]" : "bg-[#e7e3d8]"
      }`}
    >
      <span
        className={`absolute left-[3px] top-1/2 h-[20px] w-[20px] -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform ${
          checked ? "translate-x-[20px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default Toggle;
