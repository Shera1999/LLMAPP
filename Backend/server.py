from io import BytesIO
from dotenv import load_dotenv
from fastapi import FastAPI, File, UploadFile
import torch
import torchvision.transforms as transforms
from PIL import Image
import uvicorn
from model import ImageClassifier  
from fastapi.middleware.cors import CORSMiddleware
import os

# Load environment variables
load_dotenv()

# Read host and port from .env
HOST = os.getenv("HOST", "127.0.0.1")
PORT = int(os.getenv("PORT", 8000))

# FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# CIFAR-10 Class Names
class_names = [
    "airplane", "automobile", "bird", "cat", "deer", 
    "dog", "frog", "horse", "ship", "truck"
]

# Load the trained model from model.pth file
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = ImageClassifier().to(device)
model.load_state_dict(torch.load("model.pth", map_location=torch.device('cpu')))
model.eval()

# Define the transform for input image preprocessing
transform = transforms.Compose([
    transforms.Resize((32, 32)),  
    transforms.ToTensor(),  
    transforms.Normalize((0.5,), (0.5,))  
])

# Input data model
@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    # Read the image file (received as an UploadFile)
    image_bytes = await file.read()

    # Convert bytes to a PIL image
    image = Image.open(BytesIO(image_bytes)).convert('RGB') 
    
    # Ensure this line is properly indented
    image = preprocess_image(image)

    # Make prediction using the model
    with torch.no_grad():
        outputs = model(image)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        _, predicted = torch.max(outputs, 1)

    classification = class_names[predicted.item()]

    # Prepare the class probabilities as a dictionary
    class_probabilities = {
        class_names[i]: probabilities[0][i].item() for i in range(len(class_names))
    }

    # Convert to an array of objects
    probabilities_array = [
        {"class": class_name, "probability": class_probabilities[class_name]}
        for class_name in class_probabilities
    ]
    
    return {
        "prediction": classification,
        "class_probabilities": probabilities_array,
    }

# Function to preprocess the image
def preprocess_image(image: Image.Image):
    image = transform(image).unsqueeze(0)  # Add batch dimension
    image = image.to(device)  # Ensure the image is on the same device as the model
    return image

# Running the server with uvicorn
if __name__ == "__main__":
    print(f"Starting server on {HOST}:{PORT}")
    uvicorn.run("server:app", host=HOST, port=PORT, reload=True)
