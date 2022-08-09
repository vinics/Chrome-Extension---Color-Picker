import ColorDefinitionElement from "./ColorDefinitionElement.js"
import extensionLoad from "./extensionLoad.js"
import { form, inputColor, container, btnExport } from './domAssets.js'
import { handleExportToCss, handleNewColorEntry } from './appFunctions.js'


btnExport.addEventListener('click', handleExportToCss)

let counter = 1

// Execute the load function
extensionLoad()

// Save a new color
form.addEventListener('submit', handleNewColorEntry)

