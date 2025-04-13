from flask import Flask, request, jsonify, send_from_directory, send_file, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv
import numpy as np
import cv2
import torch
from pathlib import Path
import mimetypes
from basicsr.utils import imwrite
from gfpgan import GFPGANer
from basicsr.archs.rrdbnet_arch import RRDBNet
from realesrgan import RealESRGANer
import gc

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Configure CORS to allow requests from Vercel frontend
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",  # Local development
            "https://*.vercel.app",    # Vercel deployment domains
            os.getenv('FRONTEND_URL', ''),  # Custom domain if configured
            "*"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Disposition"],
        "supports_credentials": True
    }
})

# Configure folders
UPLOAD_FOLDER = Path(__file__).parent / 'uploads'
ENHANCED_FOLDER = Path(__file__).parent / 'enhanced'
MODEL_PATH = Path(__file__).parent / 'experiments/pretrained/GFPGANv1.3.pth'
REALESRGAN_MODEL_PATH = Path(__file__).parent / 'experiments/pretrained/RealESRGAN_x2plus.pth'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create necessary folders
UPLOAD_FOLDER.mkdir(exist_ok=True)
ENHANCED_FOLDER.mkdir(exist_ok=True)

app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)
app.config['ENHANCED_FOLDER'] = str(ENHANCED_FOLDER)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize models
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using device: {device}")

# Initialize background upsampler
print("Initializing RealESRGAN...")
bg_upsampler = RealESRGANer(
    scale=2,
    model_path=str(REALESRGAN_MODEL_PATH),
    model=RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=2),
    tile=400,
    tile_pad=10,
    pre_pad=0,
    half=True if torch.cuda.is_available() else False,
    device=device
)

# Initialize GFPGAN
print("Initializing GFPGAN...")
restorer = GFPGANer(
    model_path=str(MODEL_PATH),
    upscale=2,
    arch='clean',
    channel_multiplier=2,
    bg_upsampler=bg_upsampler,
    device=device
)

print("All models initialized successfully!")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_mime_type(filepath):
    mime_type, _ = mimetypes.guess_type(filepath)
    return mime_type or 'application/octet-stream'

@app.route('/')
def index():
    """Root endpoint"""
    return jsonify({
        'message': 'Welcome to Deep Revive API',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'upload': '/api/upload',
            'enhance': '/api/enhance',
            'preview': '/api/preview/<filename>',
            'download': '/api/download/<filename>'
        }
    })

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle image upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = UPLOAD_FOLDER / filename
        file.save(str(filepath))
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/enhance', methods=['POST'])
def enhance_image():
    """Enhance image using GFPGAN"""
    data = request.get_json()
    filename = data.get('filename')
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    input_path = UPLOAD_FOLDER / filename
    if not input_path.exists():
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Read image
        img = cv2.imread(str(input_path), cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({'error': 'Failed to read image'}), 400

        print(f'Processing: {filename}')
        
        try:
            # Restore faces and background
            cropped_faces, restored_faces, restored_img = restorer.enhance(
                img,
                has_aligned=False,
                only_center_face=False,
                paste_back=True
            )

            # Save restored image
            enhanced_filename = f'enhanced_{filename}'
            save_path = ENHANCED_FOLDER / enhanced_filename
            imwrite(restored_img, str(save_path))

            return jsonify({
                'message': 'Enhancement complete',
                'filename': enhanced_filename
            })

        except Exception as e:
            print(f'GFPGAN inference error: {str(e)}')
            return jsonify({'error': f'Enhancement failed: {str(e)}'}), 500

    except Exception as e:
        print(f'Error processing image: {str(e)}')
        return jsonify({'error': str(e)}), 500

@app.route('/api/preview/<filename>')
def get_preview(filename):
    """Preview enhanced image"""
    try:
        if filename.startswith('enhanced_'):
            filepath = ENHANCED_FOLDER / filename
        else:
            filepath = UPLOAD_FOLDER / filename

        if not filepath.exists():
            return jsonify({'error': 'File not found'}), 404

        # Read with OpenCV and convert to RGB
        img = cv2.imread(str(filepath))
        
        # Create response with proper mime type
        _, img_encoded = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 100])
        response = Response(img_encoded.tobytes(), content_type=get_mime_type(filepath))
        response.headers['Cache-Control'] = 'no-cache'
        return response

    except Exception as e:
        print(f"Preview error: {str(e)}")
        return jsonify({'error': 'Failed to load image'}), 500

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download enhanced image"""
    filepath = ENHANCED_FOLDER / filename
    if not filepath.exists():
        return jsonify({'error': 'File not found'}), 404

    return send_file(str(filepath), as_attachment=True)

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8080))
    app.run(host='0.0.0.0', port=port, debug=False) 