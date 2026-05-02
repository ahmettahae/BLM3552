
# Todo Uygulaması

Bulut Bilişim dersi Proje 1 kapsamında geliştirdigim çift katmanlı web uygulaması.

## Teknolojiler

- Backend: Node.js + Express
- Frontend: React
- Veritabanı: SQLite
- Bulut: AWS

## Özellikler

- Todo - ekleme, silme, tamamlama
- Filtreleme (Hepsi / Aktif / Tamamlanan)
- Progress bar
- Kalıcı veritabanı(SQLite)

## Kurulum

### Backend
cd backend
npm install
node index.js

### Frontend
cd frontend
npm install
npm start

### API Endpoints

| Method | URL | Açıklama |
|--------|-----|----------|
| GET | /todos | Tüm todoları listele |
| POST | /todos | Yeni todo ekle |
| PUT | /todos/:id | Todo tamamla/geri al |
| DELETE | /todos/:id | Todo sil |