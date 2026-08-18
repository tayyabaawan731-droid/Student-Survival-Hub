export function MemphisMark({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`memphis-mark ${className}`}>
      <i className="memphis-dot" />
      <i className="memphis-diamond" />
      <i className="memphis-line" />
    </span>
  );
}

export function MemphisBackdrop() {
  return (
    <div aria-hidden="true" className="memphis-backdrop">
      <span className="shape shape-circle shape-mint" />
      <span className="shape shape-circle shape-lilac" />
      <span className="shape shape-triangle shape-yellow" />
      <span className="shape shape-square shape-peach" />
      <span className="shape shape-dots" />
    </div>
  );
}
