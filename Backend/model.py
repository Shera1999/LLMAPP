import torch
import torch.nn as nn
import torchvision.models as models

class ImageClassifier(nn.Module):
    def __init__(self, num_classes=10):
        super(ImageClassifier, self).__init__()
        
        # Load Pretrained ResNet-18
        self.model = models.resnet18(pretrained=True)
        
        # Modify the final classification layer to match CIFAR-10 (10 classes)
        in_features = self.model.fc.in_features
        self.model.fc = nn.Linear(in_features, num_classes)
        
    def forward(self, x):
        return self.model(x)

# Test the model
if __name__ == "__main__":
    model = ImageClassifier()
    test_input = torch.randn(1, 3, 32, 32)  # CIFAR-10 image size
    test_output = model(test_input)
    print("Model Output Shape:", test_output.shape)  # Expected: (1, 10)
