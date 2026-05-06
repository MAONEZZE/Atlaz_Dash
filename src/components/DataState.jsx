export function DataState({ loading, error, onRetry, children }) {
  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div className="data-state-spinner-overlay">
          <div className="data-state-spinner" />
        </div>
      )}
      {error && !loading && (
        <div className="data-state-error-banner">
          <span>⚠ Falha ao carregar dados.</span>
          <button onClick={onRetry}>Recarregar</button>
        </div>
      )}
      <div style={loading ? { opacity: 0.5, pointerEvents: 'none' } : {}}>
        {children}
      </div>
    </div>
  )
}
