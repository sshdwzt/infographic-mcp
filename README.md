# 🖼️ infographic-mcp - Easy Infographic Image Search Server

[![Download infographic-mcp](https://img.shields.io/badge/Download-infographic--mcp-brightgreen?style=for-the-badge)](https://github.com/sshdwzt/infographic-mcp)

---

## 🧰 What is infographic-mcp?

infographic-mcp is a software designed to find infographic images from trusted sources. It uses the Serper API to search for these images and acts as a server that manages these searches. This tool helps you get visual data easily by automating the image search process.

It works on Windows and allows you to access the images through a simple server setup. You do not need any coding skills to use it.

---

## 📋 Key Features

- Connects to multiple trusted sources to get infographic images.  
- Uses Serper API for fast and accurate image search.  
- Runs on your Windows computer as a background server.  
- Easy to install and use without programming.  
- Supports updating sources and results periodically.

---

## 💻 System Requirements

To use infographic-mcp on Windows, you need:

- Windows 10 or later (64-bit recommended).  
- At least 4 GB of RAM.  
- 500 MB of free disk space.  
- Internet connection to access image sources and Serper API.  
- Python 3.8 or higher installed (if running from source).  

The application runs best on mid-range laptops or desktops.

---

## 🚀 Getting Started with infographic-mcp

You will first download the software, then run it to start the server that lets you search infographic images.

---

## ⬇️ Download and Install infographic-mcp

[![Get infographic-mcp](https://img.shields.io/badge/Get%20infographic--mcp-blue?style=for-the-badge)](https://github.com/sshdwzt/infographic-mcp)

1. Visit the GitHub page by clicking the big blue **Get infographic-mcp** button above or this link:  
   https://github.com/sshdwzt/infographic-mcp

2. On the GitHub page, locate the **Releases** section. The latest stable version will be available there.

3. Download the Windows version of infographic-mcp. This may be a file named like `infographic-mcp-setup.exe` or a `.zip` archive.  

4. If you downloaded a `.exe` file, double-click on it to start the installation. Follow the on-screen prompts to complete setup.

5. If it is a `.zip` file, right-click the file and choose **Extract All**. Then open the extracted folder.

6. For some versions, you may need Python installed if the download is source code. Find the `README` or an `install.txt` file for specific instructions if needed.

---

## 🏃 Running infographic-mcp on Windows

After installation, follow these steps to start and use the server:

1. Open **Command Prompt** (press `Windows + R`, type `cmd`, and press Enter).

2. Navigate to the directory where infographic-mcp is installed or extracted. Use the command:  
   `cd path\to\infographic-mcp`

3. Run the main program. Usually, this involves typing:  
   `python main.py`  
   or if it’s a standalone app, typing its name like:  
   `infographic-mcp.exe`

4. The program will start a local server and connect to the Serper API automatically.

5. Once running, open your web browser and go to:  
   `http://localhost:5000`

6. You will see a simple interface to enter keywords and search for infographic images.

---

## 🔧 How to Use the infographic-mcp Server

- In the search box, type the topic or keyword related to the infographic you want.  
- Press the **Search** button or hit Enter.  
- The server sends your query to the Serper API which looks for infographic images.  
- Results will show as a list of images from verified sources.  
- Click any image to view it in full size or download it.

The server stores your recent searches and image results locally, so you can browse them even if offline.

---

## ⚙️ Configuration Settings

You can adjust some settings if needed:

- **API Key**: Enter your Serper API key in the config file to authorize image searches.  
- **Port Number**: Change the port the server listens on if 5000 is busy.  
- **Source List**: Update the list of curated infographic sites through the config.  
- **Cache Duration**: Set how long search results are stored locally.  

Settings are saved in a simple text or JSON file in the app folder named `config.json` or `settings.txt`.

---

## 🐞 Troubleshooting

### The program won’t start

- Make sure Python is installed and added to your system PATH if running from source.  
- Confirm you are in the right directory when running the server command.  
- Check that no other app uses port 5000 or change the port in settings.  

### No images appear after search

- Confirm your internet connection is active.  
- Verify your Serper API key is valid and correctly entered into config.  
- Wait a moment; sometimes the server or API may be slow.  

### Errors about missing files

- Double-check that all files were extracted or installed correctly.  
- Redownload the app if files might be incomplete or corrupted.

---

## 📁 Where to Find Logs and Data

- Logs will be saved in the `logs` folder inside the installation directory.  
- Cached images and search results are kept in the `cache` folder.  
- You can clear the cache by deleting files in this folder if you want to refresh content.

---

## 📚 Additional Help

For detailed questions or support, use the **Issues** tab on the GitHub page:

https://github.com/sshdwzt/infographic-mcp/issues

You can also check the README file included in the download for any updates.

---

## 🤝 Support and Contributions

infographic-mcp is open source. While you don’t need technical skills to use it, those who know Python or server management can contribute code or report issues to improve it.

---

[![Download infographic-mcp](https://img.shields.io/badge/Download-infographic--mcp-brightgreen?style=for-the-badge)](https://github.com/sshdwzt/infographic-mcp)