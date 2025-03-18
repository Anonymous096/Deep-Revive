# Deep Revive Backend

Flask-based backend server for the Deep Revive image enhancement application.

## Setup

1. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Configure environment variables:

- Copy `.env.example` to `.env`
- Adjust settings as needed

## Running the Server

Development mode:

```bash
flask run
```

Production mode:

```bash
gunicorn server:app
```

## API Endpoints

### Health Check

- `GET /api/health`
- Returns server status

### Upload Image

- `POST /api/upload`
- Accepts multipart form data with 'file' field
- Returns uploaded filename

### Enhance Image

- `POST /api/enhance`
- Body: `{ "filename": "image.jpg", "options": {} }`
- Returns enhancement status

### Get Preview

- `GET /api/preview/<filename>`
- Returns preview of enhanced image

## Development

- Server runs on port 5000 by default
- Uploads are stored in `uploads/` directory
- Maximum file size: 16MB
- Supported formats: PNG, JPG, JPEG, GIF
