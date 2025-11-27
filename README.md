<p align="center">
  <img src="src/assets/icon128.png" alt="Tippr Logo" width="128" height="128">
</p>

<h1 align="center">Tippr</h1>

<p align="center">
  <strong>AI-Powered Browser Translation Extension</strong>
</p>

<p align="center">
  Instantly translate any text on the web using OpenAI. Select text, click the icon, get smart translations.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.0.1-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/chrome-extension-green.svg" alt="Chrome Extension">
  <img src="https://img.shields.io/badge/powered%20by-OpenAI-orange.svg" alt="Powered by OpenAI">
  <img src="https://img.shields.io/badge/license-MIT-lightgrey.svg" alt="License">
</p>

---

## ✨ Features

- **🎯 Smart Selection** — Select any text on a webpage and get instant translation
- **🌍 20+ Languages** — Support for English, Russian, Spanish, French, German, Chinese, Japanese, Korean, Arabic, and more
- **🧠 AI-Powered** — Uses OpenAI GPT for intelligent, context-aware translations
- **📝 Multiple Modes** — Translate, Simplify (ELI5), Define words, Grammar check
- **🔄 Inline Replace** — Optionally replace text directly on the page
- **📊 Translation History** — Track your translation stats and history
- **⚙️ Customizable** — Configure languages, API settings, and behavior
- **🎨 Clean UI** — Modern, minimal interface that stays out of your way

---

## 📸 Screenshots

<details>
<summary><strong>Click to view screenshots</strong></summary>

### Floating Icon & Tooltip
> When you select text, a floating icon appears. Click to see translation options.

![Selection Tooltip](screenshots/tooltip.png)

### Translation Modal
> Full translation modal with source and translated text.

![Translation Modal](screenshots/modal.png)

### Extension Popup
> Quick access to language settings and translation history.

![Popup](screenshots/popup.png)

### Settings Page
> Configure your API key, default languages, and preferences.

![Settings](screenshots/settings.png)

</details>

---

## 🚀 Installation

### From Source (Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/sammaxwell-dev/Tiq.git
   cd Tiq
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the extension**
   ```bash
   npm run build
   ```

4. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top right)
   - Click **Load unpacked**
   - Select the `dist` folder from the project

5. **Configure API Key**
   - Click the Tippr icon in your browser toolbar
   - Go to Settings tab
   - Enter your OpenAI API key
   - Save and start translating!

---

## 🔧 Getting an OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** in the sidebar
4. Click **Create new secret key**
5. Copy the key and paste it in Tippr settings

> ⚠️ Keep your API key private. Tippr stores it securely in Chrome's local storage.

---

## 📖 How to Use

### Basic Translation
1. Select any text on a webpage
2. Click the floating Tippr icon that appears
3. Choose your translation action from the tooltip
4. View the translation in the modal

### Quick Actions
| Action | Description |
|--------|-------------|
| 🌐 Translate | Translate text to your target language |
| 📖 Simplify | Explain text in simple terms (ELI5) |
| 📚 Define | Get word definitions on hover |
| ✏️ Grammar | Check and fix grammar |
| 🔄 Inline | Replace text directly on the page |

### Keyboard Shortcuts
- `Escape` — Close translation modal
- Select text + click icon — Quick translate

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview build
npm run preview
```

### Tech Stack
- **React 18** — UI components
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **Framer Motion** — Animations
- **Vite** — Build tool
- **CRXJS** — Chrome extension Vite plugin

---

## 📁 Project Structure

```
src/
├── assets/          # Icons and images
├── background/      # Service worker
├── components/      # Reusable UI components
├── content/         # Content script (tooltip, modal)
├── hooks/           # React hooks
├── lib/             # Utilities (OpenAI, storage)
├── options/         # Settings page
├── popup/           # Extension popup
├── styles/          # Tailwind CSS
└── types/           # TypeScript types
```

---

## 🌍 Supported Languages

| Language | Native Name |
|----------|-------------|
| English | English |
| Russian | Русский |
| Spanish | Español |
| French | Français |
| German | Deutsch |
| Italian | Italiano |
| Portuguese | Português |
| Chinese | 中文 |
| Japanese | 日本語 |
| Korean | 한국어 |
| Arabic | العربية |
| Hindi | हिन्दी |
| Turkish | Türkçe |
| Polish | Polski |
| Ukrainian | Українська |
| Dutch | Nederlands |
| Swedish | Svenska |
| Czech | Čeština |
| Greek | Ελληνικά |
| Hebrew | עברית |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the GPT API
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/sammaxwell-dev">sammaxwell-dev</a>
</p>
