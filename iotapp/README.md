# IoT Sensor Uygulamasi

Bulut Bilisim dersi Proje 2 kapsaminda gelistirdigim gercek zamanli veri akisi uygulamasi.

## Teknolojiler

- Backend: Node.js + WebSocket
- Frontend: React
- Bulut: AWS

## Ozellikler

- Gercek zamanli sicaklik ve nem verisi
- Durdur/Baslat kontrolu
- Olcum sikligi secimi (1, 3, 5 saniye)
- Canli veri tablosu

## Kurulum

### Backend
cd backend
npm install
node index.js

### Frontend
cd frontend
npm install
npm start

## Nasil Calisir

Uygulama WebSocket protokolu kullanarak backend ile baglanti kurar. Backend her X saniyede bir sahte sensor verisi uretir ve frontend'e gonderir. Frontend bu veriyi gercek zamanli olarak ekranda gosterir.