import { useState, useEffect, useRef } from 'react';

function App() {
  const [veriler, setVeriler] = useState([]);
  const [baglanti, setBaglanti] = useState(false);
  const [calisiyor, setCalisiyor] = useState(true);
  const [sure, setSure] = useState(1000);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:5000');
    ws.current.onopen = () => setBaglanti(true);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.tip === 'veri') {
        setVeriler(prev => [...prev.slice(-20), data.veri]);
      }
    };
    ws.current.onclose = () => setBaglanti(false);
    return () => ws.current.close();
  }, []);

  const durdurBaslat = () => {
    if (calisiyor) {
      ws.current.send(JSON.stringify({ tip: 'durdur' }));
    } else {
      ws.current.send(JSON.stringify({ tip: 'baslat' }));
    }
    setCalisiyor(!calisiyor);
  };

  const sureDegistir = (yeniSure) => {
    setSure(yeniSure);
    ws.current.send(JSON.stringify({ tip: 'sure', sure: yeniSure }));
  };

  const sonVeri = veriler[veriler.length - 1];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      color: 'white',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '30px'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '10px' }}>
        IoT Sensor Paneli
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: baglanti ? '#4ecca3' : '#ff6b6b' }}>
        {baglanti ? 'Bagli' : 'Baglanti Yok'}
      </p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '30px' }}>
        <button
          onClick={durdurBaslat}
          style={{
            padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            background: calisiyor ? '#ff6b6b' : '#4ecca3',
            color: 'white', fontWeight: 'bold', fontSize: '15px'
          }}>
          {calisiyor ? 'Durdur' : 'Baslat'}
        </button>

        <select
          value={sure}
          onChange={e => sureDegistir(Number(e.target.value))}
          style={{
            padding: '10px', borderRadius: '10px', border: 'none',
            background: '#0f3460', color: 'white', fontSize: '15px'
          }}>
          <option value={1000}>1 saniye</option>
          <option value={3000}>3 saniye</option>
          <option value={5000}>5 saniye</option>
        </select>
      </div>

      {sonVeri && (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginBottom: '30px' }}>
          <div style={{ background: '#0f3460', borderRadius: '15px', padding: '20px 40px', textAlign: 'center' }}>
            <p style={{ color: '#4ecca3', margin: '0', fontSize: '14px' }}>SICAKLIK</p>
            <p style={{ fontSize: '40px', margin: '10px 0', fontWeight: 'bold' }}>{sonVeri.sicaklik} C</p>
          </div>
          <div style={{ background: '#0f3460', borderRadius: '15px', padding: '20px 40px', textAlign: 'center' }}>
            <p style={{ color: '#4ecca3', margin: '0', fontSize: '14px' }}>NEM</p>
            <p style={{ fontSize: '40px', margin: '10px 0', fontWeight: 'bold' }}>{sonVeri.nem} %</p>
          </div>
        </div>
      )}

      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#0f3460', borderRadius: '15px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#4ecca3' }}>Son Veriler</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #4ecca3' }}>
              <th style={{ padding: '8px', textAlign: 'left' }}>Zaman</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Sicaklik</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Nem</th>
            </tr>
          </thead>
          <tbody>
            {[...veriler].reverse().map((v, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1a1a2e' }}>
                <td style={{ padding: '8px' }}>{v.zaman}</td>
                <td style={{ padding: '8px' }}>{v.sicaklik} C</td>
                <td style={{ padding: '8px' }}>{v.nem} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;