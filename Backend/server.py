from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torchvision.transforms as transforms
from PIL import Image
from model import ImageClassifier  


# FastAPI app
app = FastAPI()

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
class InputData(BaseModel):
    image_path: str  # Assuming the client will send the image path

@app.post("/predict/")
async def predict(data: InputData):
    # Preprocess the image
    image = preprocess_image(data.image_path)
    
    # Make prediction using the model
    with torch.no_grad():
        outputs = model(image.to(device))
        probabilities = torch.nn.functional.softmax(outputs, dim=1)
        _, predicted = torch.max(outputs, 1)
    
    classification=class_names[predicted.item()]
 
    return {
        "prediction": classification,
        "probabilities": probabilities[0].tolist()
    }

# Function to preprocess the image
def preprocess_image(image_path: str):
    image = Image.open(image_path)
    image = transform(image).unsqueeze(0)  # Add batch dimension
    return image
