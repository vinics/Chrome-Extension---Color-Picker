import extensionLoad from "./extensionLoad.js"
import { form, btnExport } from './domAssets.js'
import { handleExportToCss, handleNewColorEntry } from './appFunctions.js'

// Init extension reading the values already stored
extensionLoad()

// Save a new color behavior
form.addEventListener('submit', handleNewColorEntry)

// Export to css behavior
btnExport.addEventListener('click', handleExportToCss)

