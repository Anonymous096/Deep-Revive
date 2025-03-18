from flask import Flask, request, jsonify, send_from_directory, send_file, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from dotenv import load_dotenv
from PIL import Image, ImageEnhance
import numpy as np
import cv2
import torch
from pathlib import Path
import mimetypes
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.transforms.functional as F

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Configure CORS to allow image loading
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "expose_headers": ["Content-Disposition"]
    }
})

# Configure folders
UPLOAD_FOLDER = Path(__file__).parent / 'uploads'
ENHANCED_FOLDER = Path(__file__).parent / 'enhanced'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Create necessary folders
UPLOAD_FOLDER.mkdir(exist_ok=True)
ENHANCED_FOLDER.mkdir(exist_ok=True)

app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)
app.config['ENHANCED_FOLDER'] = str(ENHANCED_FOLDER)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_mime_type(filepath):
    mime_type, _ = mimetypes.guess_type(filepath)
    return mime_type or 'application/octet-stream'

def enhance_image_processing(image_path):
    """Apply image enhancement"""
    try:
        # Read image using PIL
        img = Image.open(str(image_path))
        img = img.convert('RGB')
        
        # Apply basic image enhancement
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.5)  # Increase contrast
        
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.5)  # Increase sharpness
        
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.2)  # Enhance color
        
        return img
    except Exception as e:
        print(f"Error in enhance_image_processing: {str(e)}")
        raise

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
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        return jsonify({
            'message': 'File uploaded successfully',
            'filename': filename
        })
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/api/enhance', methods=['POST'])
def enhance_image():
    """Enhance uploaded image"""
    data = request.get_json()
    filename = data.get('filename')
    options = data.get('options', {})
    
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    input_path = Path(app.config['UPLOAD_FOLDER']) / filename
    if not input_path.exists():
        return jsonify({'error': 'File not found'}), 404
    
    try:
        # Process the image
        enhanced = enhance_image_processing(input_path)
        
        # Save enhanced image
        enhanced_filename = f"enhanced_{filename}"
        output_path = Path(app.config['ENHANCED_FOLDER']) / enhanced_filename
        enhanced.save(str(output_path))
        
        return jsonify({
            'message': 'Enhancement complete',
            'filename': enhanced_filename
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/preview/<filename>')
def get_preview(filename):
    """Get preview of image"""
    try:
        if filename.startswith('enhanced_'):
            filepath = os.path.join(app.config['ENHANCED_FOLDER'], filename)
        else:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'File not found'}), 404

        # Read the image file
        with open(filepath, 'rb') as f:
            image_data = f.read()
        
        # Create response with proper mime type
        response = Response(image_data, content_type=get_mime_type(filepath))
        response.headers['Cache-Control'] = 'public, max-age=31536000'
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download enhanced image"""
    if not filename.startswith('enhanced_'):
        filename = f"enhanced_{filename}"
    
    filepath = os.path.join(app.config['ENHANCED_FOLDER'], filename)
    if not os.path.exists(filepath):
        return jsonify({'error': 'Enhanced file not found'}), 404
    
    try:
        return send_file(
            filepath,
            as_attachment=True,
            download_name=filename
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True) 