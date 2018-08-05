# Markdown New Tab

[![Build Status](https://img.shields.io/travis/plibither8/markdown-new-tab/master.svg?style=flat-square)](https://travis-ci.org/plibither8/markdown-new-tab)
[![Chrome Webstore Version](https://img.shields.io/chrome-web-store/v/demppioeofcekpjcnlkmdjbabifjnokj.svg)](https://chrome.google.com/webstore/detail/markdown-new-tab/demppioeofcekpjcnlkmdjbabifjnokj)
[![Chrome Webstore Users](https://img.shields.io/chrome-web-store/users/demppioeofcekpjcnlkmdjbabifjnokj.svg)](https://chrome.google.com/webstore/detail/markdown-new-tab/demppioeofcekpjcnlkmdjbabifjnokj)
[![Licence](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[![Made_with_love_in India](https://madewithlove.org.in/badge.svg)](https://madewithlove.org.in/)

> Take down notes 🗒️, save reminders ⏰, paste links 🔗, create checklists ☑️ or tables, all using markdown... directly in your 'New Tab' page! Markdown New Tab is a replacement for the default 'New Tab' page on Google Chrome 🆕 🎉.

<a href='https://chrome.google.com/webstore/detail/shufflepaper/demppioeofcekpjcnlkmdjbabifjnokj?utm_campaign=PartBadge'><img alt='Get it on the Chrome Webstore' src='https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png' height="58px"/></a>

![Demo GIF](/assets/demo.gif)

## About

Markdown New Tab is a replacement for the default Google Chrome new tab page. Refer to [this brilliant cheat sheat](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) to get familiar with the markdown syntax.

### Features

* Take down *styled* notes 🗒️, create checklists ☑️, links 🔗, tables and reminders ⏰, add images 🖼️ (and all other frills associated with mArKdOwN [M↓])

* ⏰ 💾 Automatically saves (and deletes) revision history for you to look back and reminisce

* ⌨️ Use [keyboard shortcuts](#Usage) to toggle between edit and save the notes

* 💪 💪 ACTIVATE POWERMODE! (enable in settings)

### Upcoming

* Sync notes, revision history and settings between all Chrome browsers you are logged into

* Change background and foreground colours

* Split editing to show live preview

* Support for Mozilla Firefox (???)

## Usage

* You can edit and save the notes either by pressing the buttons on the top right, or by using the shortcuts <kbd>Ctrl</kbd> + <kbd>X</kbd> (or <kbd>Cmd</kbd> + <kbd>X</kbd> on Mac) to edit the text and <kbd>Ctrl</kbd> + <kbd>S</kbd> (or <kbd>Cmd</kbd> + <kbd>S</kbd> on Mac) to save the text.

* To save and edit the notes by using <kbd>Ctrl</kbd> + <kbd>↵</kbd> (or <kbd>Cmd</kbd> + <kbd>↵</kbd> on Mac), go to settings and enable it.

* Revision history can be accessed by clicking "Last Edited: ____" on the bottom right corner.

## Development

1. Clone this repo:

```sh
$ git clone https://github.com/plibither8/markdown-new-tab
```

2. Open Chrome and go to `chrome://extensions`
3. Enable 'Developer Mode' by checking the tickbox (on the top of the page).
4. Click the 'Load Unpacked Extension' button and select the `dist/` folder of the cloned repository.
5. The extension should be loaded now and the 'New Tab' page should be Markdown New Tab. 🎉

> The code makes use of `localStorage()` to save the raw text, revision history, last edited time and date, settings and last cursor position.

### Testing in Firefox

In Firefox the extension can be installed temporarily until you restart the browser. To do so:

1. enter `about:debugging` in the URL bar
2. click "Load Temporary Add-on"
3. open the extension's directory in your local repo and select [`dist/manifest.json`](dist/manifest.json)

More info [here](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

## License

Copyright (c) Mihir Chaturvedi. All rights reserved.

Licensed under the [MIT](LICENSE) License.
