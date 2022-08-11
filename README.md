# Chrome Extension - Color Picker

#### Video Demo: https://youtu.be/Nji_N-Kk1Ls

#### Description: A chrome extension color picker application to extract colors from websites and images.


## How to use
### Set up extension
Access your extension manager:

![Chrome extension manager access](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome%20extension%20manager%20access.png)

### Load extension
Check if Chrome is in developer mode and run "Load unpacked extension":

![Chrome load unpacked extension](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-load-extension.png)

### Pin the extension to the browser bar

![Chrome fix extension on browser bar](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-fix-extension.png)

### Add colors
Click on the extension icon and select the color picker input:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-addColor.png)

A menu will popup and allow the color selection and adjustment:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-addColor-colorPicker.png)

With the color selected, click the button Add on the extension popup interface:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-addColor-colorSave.png)

The color will be shown right below:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-addColor-colorEntry.png)

### Change color name
To change the color name just click on it and a new name prompt will popup:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-changeName-click.png)

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-changeColorName.png)

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-changeName-update.png)

### Color code
To see the code of a specific color just hover the mouse over the color entry icon:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-colorToolTip.png)

### Delete color entry
Click on the trash can icon to delete that color entry:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-deleteColorEntry.png)

### Export to css
As long at least 1 color entry exists, a export button will appear allowing a download of the named colors as css variables:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-getCss.png)

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-cssFile.png)

## Architecture
### Folder structure
The application is composed of 5 main parts:

* **root:** Defines how the application should run and be set
* **views:** Defines the application interface
* **styles:** Defines the application theme and appearence
* **scripts:** Defines the application behavior
* **imgs:** Contains all the image used by the application and this document

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-folder%20structure.png)

### Root
At the root of the applicatation is set a configuration file for the code editor, setting some definitions like line indent and others:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-editorConfig.png)

The manifest is a json file, required from Google, to comunicate how the application behaves and works:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome%20extension-manifest.png)

In this file it is defined the icon images that should be use on the browser

### Views
There is only 1 file here that represents what should be shown on the popup interface that appears when the extension button is clicked:

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/colorPicker-addColor-colorEntry.png)


In this html file it is defined a form with a color input and submit button to work as the input setup to save a new color in what is called a "color collection".

![Adding colors](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-extension-view-form.png)

A color collection is an array of objects that represents all the colors and names that were saved previosly.

## Styles
It was used flexbox to display elements in a stacked column.

Colors were separated from the main css file and used as css variables to be easier to manipulate it.

![Styles: Definition file](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-styles-files.png)

![Styles: Color variables](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-styles-colors.png)

## Scripts
### > appFunctions.js
Define all functions that provide business logic of the application.

### > ColorDefinitionElement.js
Class that represents that a color entry.

### > domAssets.js
Query all the elements that will be used or referenced from the *index.html*.

![Querying html elements](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-scripts-domAssets.png)

### > extensionLoad.js
The chrome API is used to access the storage and check if the user had already a collection saved.

It is also checked if there is any color saved to show or hide the "Get CSS" export button.

![extensionLoad.js: export button hide](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-scripts-extensionLoad-buttonHide.png)

In case there is a collection on the storage, for each element in the collection, a ColorDefinition instance is created.

![extensionLoad.js: color collection elements compose](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-scripts-extensionLoad-ColorDefinitionElement.png)

Each instance has a property "htmlElement" that return a Html element that represents a color saved, then appended to the container.


### > main.js
The main file that is included on the *views/index.html*.
It sets the initial behaviour of the application and sets the event handlers on the interface:

![Javascript file: main.js](https://github.com/vinics/chromeExt-ColorPicker/blob/main/imgs/chrome-scripts-main.png)


## Special thanks
I would like to thank all people that made CS50 possible on edX. I was able to learn much more about the foundation of the computer science. This chrome extension was done as the final project required at the end of the course and I much satisfied with my progress througout the experience that is CS50.

My honest thanks to David J. Malan and all of the staff envolved with this amazing work and experience called CS50.
