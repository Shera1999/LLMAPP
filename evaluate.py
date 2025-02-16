import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from prepare_data import test_dataset  # Import test set
from model import ImageClassifier

# Load trained model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = ImageClassifier().to(device)
model.load_state_dict(torch.load("model.pth"))
model.eval()

# Test Loader
BATCH_SIZE = 32
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

# Evaluation Function
def evaluate():
    correct = 0
    total = 0
    with torch.no_grad():
        for images, labels in test_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(images)
            _, predicted = torch.max(outputs, 1)
            correct += (predicted == labels).sum().item()
            total += labels.size(0)
    
    accuracy = 100 * correct / total
    print(f"Test Accuracy: {accuracy:.2f}%")

# Run Evaluation
if __name__ == "__main__":
    evaluate()
