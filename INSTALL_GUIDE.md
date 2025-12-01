# How to Install Gharu Hiraa as Desktop Application

## 📱 Installation Methods

### Method 1: Install as PWA (Recommended - Easiest)

#### For Windows (Chrome/Edge):
1. **Start the application:**
   ```powershell
   npm run dev
   ```

2. **Open in browser:**
   - Go to: `http://localhost:8001`

3. **Install the app:**
   - Look for the **install icon** (⊕ or computer icon) in the address bar
   - **OR** Click the three dots menu → **Install Gharu Hiraa**
   - **OR** Press `Ctrl+Shift+A` (Edge)

4. **The app will install:**
   - Appears in Start Menu
   - Can be pinned to Taskbar
   - Runs in its own window
   - No browser UI visible

5. **Launch anytime:**
   - Find "Gharu Hiraa" in Start Menu
   - Or use desktop shortcut

#### For Production (After Deployment):
1. Visit your deployed website URL
2. Click install icon in address bar
3. App installs permanently
4. Works even when website is down (cached)

---

## 🖥️ Method 2: Run as Standalone Server

### Option A: Development Mode
```powershell
# Start the server
npm run dev

# Access at: http://localhost:8001
# Keep terminal open while using
```

### Option B: Production Build
```powershell
# Build the application
npm run build

# Start production server
npm run start

# Access at: http://localhost:8001
# Better performance than dev mode
```

---

## 🚀 Method 3: Create Windows Executable (Advanced)

### Using Electron (Full Desktop App):

1. **Install Electron dependencies:**
   ```powershell
   npm install --save-dev electron electron-builder
   ```

2. **Create electron.js:**
   ```javascript
   const { app, BrowserWindow } = require('electron');
   const { spawn } = require('child_process');
   const path = require('path');

   let mainWindow;
   let serverProcess;

   function createWindow() {
     mainWindow = new BrowserWindow({
       width: 1400,
       height: 900,
       icon: path.join(__dirname, 'public/logo.jpg'),
       webPreferences: {
         nodeIntegration: false,
         contextIsolation: true,
       },
     });

     mainWindow.loadURL('http://localhost:8001');
   }

   function startServer() {
     serverProcess = spawn('npm', ['run', 'start'], {
       cwd: __dirname,
       shell: true,
     });
   }

   app.whenReady().then(() => {
     startServer();
     setTimeout(createWindow, 3000); // Wait for server
   });

   app.on('window-all-closed', () => {
     if (serverProcess) serverProcess.kill();
     app.quit();
   });
   ```

3. **Update package.json:**
   ```json
   {
     "scripts": {
       "electron": "electron .",
       "electron-build": "electron-builder"
     },
     "main": "electron.js",
     "build": {
       "appId": "com.gharuhiraa.management",
       "productName": "Gharu Hiraa",
       "win": {
         "target": ["nsis"],
         "icon": "public/logo.jpg"
       }
     }
   }
   ```

4. **Build Windows installer:**
   ```powershell
   npm run build  # Build Next.js
   npm run electron-build  # Create .exe
   ```

---

## ✅ Verification

### Check if PWA is installed:
- Windows: Look in Start Menu for "Gharu Hiraa"
- Edge: edge://apps/
- Chrome: chrome://apps/

### Check if Service Worker is active:
- Open browser DevTools (F12)
- Go to **Application** → **Service Workers**
- Should see: `http://localhost:8001/sw.js` (activated)

---

## 📋 Features When Installed

### PWA Installation Gives You:
✅ **Standalone window** - No browser UI
✅ **Start Menu entry** - Launch like any app
✅ **Desktop shortcut** - Pin to desktop
✅ **Taskbar icon** - Pin to taskbar
✅ **Offline support** - Works without internet (cached pages)
✅ **Fast loading** - Cached resources
✅ **Auto updates** - Gets updates from server

### What You Need Running:
- **Database:** MongoDB (online at Atlas)
- **Server:** npm run dev/start (must be running)
- **PWA:** Installed once, always available

---

## 🔧 Troubleshooting

### Install button doesn't appear:
- Make sure you're on http://localhost:8001
- Try refreshing the page
- Check browser supports PWA (Chrome, Edge)
- Clear browser cache and try again

### Service Worker not registering:
- Check browser console for errors
- Make sure sw.js is in /public folder
- Try hard refresh: Ctrl+Shift+R

### App won't launch after install:
- Make sure server is running: npm run dev
- Check port 8001 is not blocked
- Try uninstall and reinstall

---

## 📱 Uninstall

### Windows:
- Settings → Apps → Gharu Hiraa → Uninstall
- Or right-click app in Start Menu → Uninstall

### Browser:
- Edge: edge://apps/ → Click three dots → Uninstall
- Chrome: chrome://apps/ → Right-click → Remove

---

## 🎯 Recommended Setup

### For Daily Use:
1. ✅ Install as PWA (Method 1)
2. ✅ Create startup script to launch server
3. ✅ Pin app to taskbar
4. ✅ Use like any desktop application

### Startup Script (start-app.bat):
```batch
@echo off
cd "C:\Cave of Hiraa Management system"
start cmd /k npm run dev
timeout /t 5
start http://localhost:8001
```

---

## 💡 Benefits of PWA

**Easy Installation:**
- No complex setup
- One-click install from browser
- No admin rights needed

**Always Updated:**
- Gets latest features automatically
- No manual updates required

**Works Offline:**
- Cached pages work without internet
- Perfect for local network use

**Professional:**
- Own window like desktop app
- No browser tabs/UI
- Clean, focused interface

---

## 🔐 Security Note

The installed PWA connects to:
- **Local Server:** http://localhost:8001
- **Database:** MongoDB Atlas (secure connection)

Keep your server running for the app to work!

---

## 📞 Support

If you have issues:
1. Check server is running (npm run dev)
2. Check port 8001 is available
3. Try browser hard refresh (Ctrl+Shift+R)
4. Reinstall the PWA
5. Check MongoDB connection

---

Built with ❤️ for Gharu Hiraa School for Quranic Memorization

