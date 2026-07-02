const STEPS = ['Identificação', 'Protocolo', 'Dados', 'Resultados', 'Orientação'];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between max-w-3xl mx-auto mb-8 px-2">
      {STEPS.map((label, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <div key={label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                  active
                    ? 'border-jsm-teal text-jsm-teal'
                    : done
                    ? 'border-jsm-teal bg-jsm-teal text-jsm-bg'
                    : 'border-white/20 text-jsm-label'
                }`}
              >
                {n}
              </div>
              <span className={`text-[11px] hidden sm:block ${active ? 'text-jsm-teal' : 'text-jsm-label'}`}>
                {label}
              </span>
            </div>
            {n < STEPS.length && (
              <div className={`flex-1 h-px mx-1 ${done ? 'bg-jsm-teal' : 'bg-white/10'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
