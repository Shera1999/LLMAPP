import matplotlib.pyplot as plt
import torchvision
import numpy as np
from prepare_data import train_loader, class_labels  # Import dataset

# Get a batch of training data
dataiter = iter(train_loader)
images, labels = next(dataiter)

# Function to display images
def imshow(img):
    img = img / 2 + 0.5  # Unnormalize
    npimg = img.numpy()
    plt.imshow(np.transpose(npimg, (1, 2, 0)))
    plt.show()

# Show images with labels
imshow(torchvision.utils.make_grid(images[:8]))
print("Labels:", [class_labels[label] for label in labels[:8]])
