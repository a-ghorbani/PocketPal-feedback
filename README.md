# PocketPal AI 📱🚀

PocketPal AI is a pocket-sized AI assistant powered by small language models (SLMs) that run directly on your phone. Designed for both iOS and Android, PocketPal AI lets you interact with various SLMs without the need for an internet connection.

## Table of Contents

- [PocketPal AI 📱🚀](#pocketpal-ai-)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Installation](#installation)
    - [iOS](#ios)
    - [Android](#android)
  - [Usage](#usage)
    - [Downloading a Model](#downloading-a-model)
    - [Loading a Model](#loading-a-model)
    - [Advanced Settings](#advanced-settings)
    - [Chatting with the model](#chatting-with-the-model)
    - [Copying Text](#copying-text)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Getting Started](#getting-started)
    - [Scripts](#scripts)
  - [Contributing](#contributing)
    - [Quick Start for Contributors](#quick-start-for-contributors)
  - [Roadmap](#roadmap)
  - [License](#license)
  - [Contact](#contact)

## Features

- **Offline AI Assistance**: Run language models directly on your device without internet connectivity.
- **Model Flexibility**: Download and swap between multiple SLMs, including Danube 2 and 3, Phi, Gemma 2, and Qwen.
- **Auto Offload/Load**: Automatically manage memory by offloading models when the app is in the background.
- **Inference Settings**: Customize model parameters like system prompt, temperature, BOS token, and chat templates.
- **Real-Time Performance Metrics**: View tokens per second and milliseconds per token during AI response generation.

## Installation

### iOS

Download PocketPal AI from the App Store:

[**Download on the App Store**](https://apps.apple.com/us/app/pocketpal-ai/id6502579498)

### Android

Get PocketPal AI on Google Play:

[**Get it on Google Play**](https://play.google.com/store/apps/details?id=com.pocketpalai)

## Usage

For a detailed guide on how to use PocketPal AI, check out the [Getting Started Guide](docs/getting_started.md).

### Downloading a Model

1. Open the app and tap the **Menu** icon (☰).
2. Navigate to the **Models** page.
3. Choose a model from the list and tap **Download**.

### Loading a Model

- After downloading, tap **Load** next to the model to bring it into memory.

### Advanced Settings

- Tap the chevron icon (v) next to a model to access advanced settings like temperature, BOS token, and chat templates.

### Chatting with the model 

1. Ensure a model is loaded.
2. Navigate to the **Chat** page from the menu.
3. Start conversing with your AI assistant!

### Copying Text

- **Copy Entire Response**: Tap the copy icon at the bottom of the AI's response bubble.
- **Copy Specific Paragraph**: Long-press on a paragraph to copy its content.

*Note*: Preserving text formatting while copying is currently limited. We're working on improving this feature.

## Development Setup

Interested in contributing or running the app locally? Follow the steps below.

### Prerequisites

- **Node.js** (version 18 or higher)
- **Yarn**
- **React Native CLI**
- **Xcode** (for iOS development)
- **Android Studio** (for Android development)

### Getting Started

1. **Fork and Clone the Repository**

   ```bash
   git clone https://github.com/a-ghorbani/pocketpal-ai
   cd pocketpal-ai
   ```

2. **Install Dependencies**

   ```bash
   yarn install
   ```

3. **Install Pod Dependencies (iOS Only)**

   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Run the App**

   - **iOS Simulator**

     ```bash
     yarn ios
     ```

   - **Android Emulator**

     ```bash
     yarn android
     ```

### Scripts

- **Start Metro Bundler**

  ```bash
  yarn start
  ```

- **Clean Build Artifacts**

  ```bash
  yarn clean
  ```

- **Lint and Type Check**

  ```bash
  yarn lint
  yarn typecheck
  ```

- **Run Tests**

  ```bash
  yarn test
  ```

## Contributing

We welcome all contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) before you start.

### Quick Start for Contributors

1. **Fork the Repository**
2. **Create a New Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
4. **Test Your Changes**

   - **Run on iOS**

     ```bash
     yarn ios
     ```

   - **Run on Android**

     ```bash
     yarn android
     ```

5. **Lint and Type Check**

   ```bash
   yarn lint
   yarn typecheck
   ```

6. **Commit Your Changes**

   - Follow the Conventional Commits format:

     ```bash
     git commit -m "feat: add new model support"
     ```

7. **Push and Open a Pull Request**

   ```bash
   git push origin feature/your-feature-name
   ```

## Roadmap

- **Support for more Android Devices**: Add support for more Android devices (diversity of the Android ecosystem is a challenge so we need more support from the community).
- **Improved Text Copying**: Enhance the ability to copy text while preserving formatting.
- **New Models**: Add support for more tiny LLMs.
- **UI Enhancements**: Improve the overall user interface and user experience.
- **Improve Documentation**: Improve the documentation of the project.

Feel free to open issues to suggest features or report bugs.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or feedback, please open an issue.

## Acknowledgements

PocketPal AI is built using the amazing work from:

- **[llama.cpp](https://github.com/ggerganov/llama.cpp)**: Enables efficient inference of LLMs on local devices.
- **[llama.rn](https://github.com/mybigday/llama.rn)**: Implements llama.cpp bindings into React Native.

---

Happy exploring! 🚀📱✨
