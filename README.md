# Markdown New Tab

[![Build Status](https://img.shields.io/travis/plibither8/markdown-new-tab/master.svg?style=flat-square)](https://travis-ci.org/plibither8/licensed)
[![Licence](https://img.shields.io/npm/l/licensed.svg?maxAge=2592000&style=flat-square)](LICENSE)

[![Made_with_love_in India](https://img.shields.io/badge/Made_with_love_in-India-DC3545.svg)](https://madewithlove.org.in/)

> Take down notes 🗒️, save reminders ⏰, paste links 🔗, create checklists ☑️ or tables, all using markdown... directly in your 'New Tab' page! Markdown New Tab is a replacement for the default 'New Tab' page on Google Chrome 🆕 🎉.

![Demo GIF](/assets/demo.gif)

# Setup

Since this extension is not available on the Chrome Webstore (it's only $5, I know... :| ), it needs to be manually installed and loaded.

1. Clone this repo:

```sh
$ git clone https://github.com/plibither8/markdown-new-tab
```
2. Open Chrome and go to `chrome://extensions`
3. Enable 'Developer Mode' by checking the tickbox (on the top of the page).
4. Click the 'Load Unpacked Extension' button and select the `dist/` folder of the cloned repository.
5. The extension should be loaded now and the 'New Tab' page should be Markdown New Tab. 🎉

# Usage

You can edit and save the texts either by pressing the buttons on the top right, or by using the shortcuts <kbd>Ctrl</kbd> + <kbd>E</kbd> to edit the text and <kbd>Ctrl</kbd> + <kbd>S</kbd> to save the text.

The code makes use of `localStorage()` to save the raw text and the time and date of when the edit has been made.

# To do

* Enable user to change colors/add themes
* Implement user-defined markdown rendering
* Other gimmicks to make it less minimalistic (?)


# License

Copyright (c) Mihir Chaturvedi. All rights reserved.

Licensed under the [MIT](LICENSE) License.