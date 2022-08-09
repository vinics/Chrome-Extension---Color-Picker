import extensionLoad from "./extensionLoad.js"
import { form, inputColor, container, btnExport } from './domAssets.js'
import { handleExportToCss, handleNewColorEntry } from './appFunctions.js'

// Execute the load function
extensionLoad()

// Export to css behavior
btnExport.addEventListener('click', handleExportToCss)

// Save a new color behavior
form.addEventListener('submit', handleNewColorEntry)

