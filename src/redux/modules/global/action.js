import * as types from "@/redux/mutation-types"

// * setToken
export const setToken = (token) => ({
	type: types.SET_TOKEN,
	token
})

// * setAssemblySize
export const setAssemblySize = (assemblySize) => ({
	type: types.SET_ASSEMBLY_SIZE,
	assemblySize
})

// * setLanguage
export const setLanguage = (language) => ({
	type: types.SET_LANGUAGE,
	language
})

// * setThemeConfig
export const setThemeConfig = (themeConfig) => ({
	type: types.SET_THEME_CONFIG,
	themeConfig
})
