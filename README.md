# DeepRevive - AI-Powered Image Restoration

DeepRevive is a full-stack application that uses advanced AI models (GFPGAN and RealESRGAN) to restore and enhance old or damaged images. The application features a modern Next.js frontend and a Flask backend with GPU-accelerated image processing.

## Features

- 🖼️ Image restoration and enhancement
- 👤 Face restoration using GFPGAN
- 🖼️ Background enhancement using RealESRGAN
- 🎨 Modern, responsive UI
- ⚡ Fast processing with GPU acceleration
- 🔒 Secure file handling
- 🌐 CORS-enabled API

## Tech Stack

### Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- React
- Vercel (deployment)

### Backend

- Python 3.9
- Flask
- GFPGAN
- RealESRGAN
- PyTorch
- OpenCV
- Docker

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- CUDA-capable GPU (recommended for faster processing)
- Docker (for containerized deployment)

## Local Development Setup

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<YOUR_API_KEY>
CLERK_SECRET_KEY=<YOUR_API_KEY>

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Create a `.env` file:

```env
FLASK_APP=server.py
FLASK_ENV=development
FLASK_DEBUG=1
PORT=5000
MAX_CONTENT_LENGTH=16777216  # 16MB in bytes
UPLOAD_FOLDER=uploads
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif
```

5. Clone the GFPGAN repository

```bash
git clone https://github.com/TencentARC/GFPGAN.git
cd GFPGAN
pip install -r requirements.txt
pip install basicsr facexlib realesrgan flask
```

6. Start the Flask server:

```bash
python server.py
# OR
flask run --port=5001
```

The backend API will be available at `http://localhost:5001`

## Docker Deployment

### Building the Backend Container

1. Navigate to the backend directory:

```bash
cd backend
```

2. Build the Docker image:

```bash
docker build -t deeprevive-backend .
```

3. Run the container:

```bash
# Before running the container make sure to activate virtual env in the backend folder and install every required dependencies
docker run -it -p 5001:5001 deeprevive-backend
```

## Production Deployment

### Backend Deployment (Google Cloud Run)

1. Install Google Cloud SDK
2. Initialize the project:

```bash
gcloud init
gcloud projects create deeprevive-backend
gcloud config set project deeprevive-backend
```

3. Enable required APIs:

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

4. Deploy using Cloud Build:

```bash
gcloud builds submit
```

### Frontend Deployment (Vercel)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. For production deployments:

```bash
vercel --prod
```

## API Endpoints

- `GET /` - Welcome message and API information
- `GET /api/health` - Health check endpoint
- `POST /api/upload` - Upload an image
- `POST /api/enhance` - Enhance an uploaded image
- `GET /api/preview/<filename>` - Preview an image
- `GET /api/download/<filename>` - Download an enhanced image

## Environment Variables

### Backend

- `FLASK_ENV` - Environment (development/production)
- `PORT` - Server port (default: 5001)
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend

- `NEXT_PUBLIC_API_URL` - Backend API URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [GFPGAN](https://github.com/TencentARC/GFPGAN) for face restoration
- [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) for background enhancement
- [Next.js](https://nextjs.org/) for the frontend framework
- [Flask](https://flask.palletsprojects.com/) for the backend framework
