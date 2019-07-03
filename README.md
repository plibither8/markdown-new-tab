# Markdown New Tab

[link-cws]: https://chrome.google.com/webstore/detail/demppioeofcekpjcnlkmdjbabifjnokj "Version published on Chrome Web Store"
[link-amo]: https://addons.mozilla.org/en-US/firefox/addon/markdown-new-tab/ "Version published on Mozilla Add-ons"

[![Licence](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE) 
[![Build Status](https://img.shields.io/travis/plibither8/markdown-new-tab/master.svg?style=flat-square)](https://travis-ci.org/plibither8/markdown-new-tab)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/demppioeofcekpjcnlkmdjbabifjnokj.svg?label=chrome%20users&style=flat-square)][link-cws]
[![Mozilla Add-on](https://img.shields.io/amo/users/markdown-new-tab.svg?label=firefox%20users&style=flat-square)][link-amo]
![Made with love in India](https://madewithlove.now.sh/in?heart=true&colorB=%23ff701f&template=flat-square)

> Take down notes 🗒️, save reminders ⏰, paste links 🔗, create checklists ☑️ or tables, all using markdown... directly in your 'New Tab' page! Markdown New Tab is a replacement for the default 'New Tab' page on Google Chrome 🆕 🎉.

![Demo GIF](/assets/demo.gif)

## Install

- [**Chrome** extension][link-cws] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/demppioeofcekpjcnlkmdjbabifjnokj.svg?label=%20">][link-cws]
- [**Firefox** add-on][link-amo] [<img valign="middle" src="https://img.shields.io/amo/v/markdown-new-tab.svg?label=%20">][link-amo]
- **Opera** extension: Use [this Opera extension](https://addons.opera.com/en/extensions/details/download-chrome-extension-9/) to install the Chrome version.

## About

Markdown New Tab is a replacement for the default Google Chrome new tab page. Refer to [this brilliant guide](https://github.github.com/gfm/) to get familiar with the markdown syntax.

### Features

* Take down _**`styled`**_ notes 🗒️, create checklists ☑️, links 🔗, tables and reminders ⏰, add images 🖼️ (and all other frills associated with ｍａｒｋｄｏｗｎ [M↓])

* ⏰ 💾 Automatically saves (and deletes) revision history for you to look back and reminisce

* ⌨️ Use [keyboard shortcuts](#Usage) to toggle between edit and save the notes

* 💪 💪 ACTIVATE POWERMODE! (enable in settings)

* Sync notes, revision history and settings between all Chrome browsers you are logged into

### Upcoming

* Change background and foreground colours

* Split editing to show live preview

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

## Donate

Markdown New Tab was made by me during my study-breaks and free time. If you like and have enjoyed it, please consider donating a small amount (any amount will be really appreciated!) to support and sustain its development. Thank you!

[![Donate](https://img.shields.io/badge/donate-PayPal-blue.svg?style=for-the-badge&logo=paypal)](https://paypal.me/plibither8)

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png)](https://www.buymeacoffee.com/plibither8)

## License

Copyright (c) Mihir Chaturvedi. All rights reserved.

Licensed under the [MIT](LICENSE) License.
