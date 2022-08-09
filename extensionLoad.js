import ColorDefinitionElement from "./ColorDefinitionElement.js"
import { container, btnExport } from './domAssets.js'

// Load saved colors
function extensionLoad() {
  // Clear current content of container element
  container.innerHTML = ''

  // Load all colors saved so far on the current work
  chrome.storage.local.get([`chromeExtensionColorPicker`], (result) => {

    if (!result.chromeExtensionColorPicker) {
      if (!btnExport.classList.contains('btnDisabled')) {
        btnExport.classList.add('btnDisabled')
      }
      return
    }


    if (btnExport.classList.contains('btnDisabled')) {
      btnExport.classList.remove('btnDisabled')
    }

    const colorCollection = JSON.parse(result.chromeExtensionColorPicker)

    if (colorCollection.length === 0) {
      if (!btnExport.classList.contains('btnDisabled')) {
        btnExport.classList.add('btnDisabled')
      }
    }

    colorCollection.forEach(colorEntry => {
      const element = new ColorDefinitionElement(colorEntry.color, colorEntry.label)
      container.appendChild(element.htmlElement)
    })

  })
}

export default extensionLoad
