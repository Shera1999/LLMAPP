import os
import json
import torch
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader, random_split

# Create directories for dataset storage
RAW_DATA_DIR = "data/raw"
PROCESSED_DATA_DIR = "data/processed"
os.makedirs(RAW_DATA_DIR, exist_ok=True)
os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)

# Define image transformations
transform = transforms.Compose([
    transforms.ToTensor(),  # Convert to tensor
    transforms.Normalize((0.5,), (0.5,))  # Normalize to [-1, 1]
])

# Download CIFAR-10 dataset
print("Downloading CIFAR-10 dataset...")
train_dataset = torchvision.datasets.CIFAR10(root=RAW_DATA_DIR, train=True, download=True, transform=transform)
test_dataset = torchvision.datasets.CIFAR10(root=RAW_DATA_DIR, train=False, download=True, transform=transform)

# Split train dataset into training and validation sets
train_size = int(0.8 * len(train_dataset))
val_size = len(train_dataset) - train_size
train_dataset, val_dataset = random_split(train_dataset, [train_size, val_size])

# Create data loaders
BATCH_SIZE = 32
train_loader = DataLoader(train_dataset, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=BATCH_SIZE, shuffle=False)
test_loader = DataLoader(test_dataset, batch_size=BATCH_SIZE, shuffle=False)

# Save class labels
class_labels = train_dataset.dataset.classes
with open(os.path.join(PROCESSED_DATA_DIR, "class_labels.json"), "w") as f:
    json.dump(class_labels, f)

print("Dataset preparation completed. Files saved in:", PROCESSED_DATA_DIR)
