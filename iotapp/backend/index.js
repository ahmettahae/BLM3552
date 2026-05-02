const express = require('express');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Yeni baglanti!');
  let sure = 1000;
  let timer = null;

  const veriGonder = () => {
    const veri = {
      zaman: new Date().toLocaleTimeString(),
      sicaklik: (20 + Math.random() * 15).toFixed(1),
      nem: (40 + Math.random() * 40).toFixed(1)
    };
    ws.send(JSON.stringify({ tip: 'veri', veri }));
  };

  const baslat = () => {
    if (timer) clearInterval(timer);
    timer = setInterval(veriGonder, sure);
  };

  baslat();

  ws.on('message', (mesaj) => {
    const data = JSON.parse(mesaj);
    if (data.tip === 'sure') {
      sure = data.sure;
      baslat();
    }
    if (data.tip === 'durdur') {
      clearInterval(timer);
      timer = null;
    }
    if (data.tip === 'baslat') {
      baslat();
    }
  });

  ws.on('close', () => {
    clearInterval(timer);
    console.log('Baglanti kapandi');
  });
});

app.get('/', (req, res) => res.send('IoT Backend calisiyor!'));

server.listen(5000, () => console.log('Sunucu calisiyor: http://localhost:5000'));