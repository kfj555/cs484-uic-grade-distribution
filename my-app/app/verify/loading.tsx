export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          border: '2px solid #000',
          borderRadius: 8,
          padding: 24,
          background: '#fff',
          textAlign: 'center',
        }}
      >
        <p>Loading…</p>
      </div>
    </div>
  );
}
