export default req => {
	if (req.params.tmdbType === 'tv' || req.params.tmdbType === 'movie')
		return {
			tmdbType: req.params.tmdbType,
			tmdbTypeError: createError({ statusCode: 404, message: `Page not found: ${req.path}` })
		}
	return {
		tmdbType: false,
		tmdbTypeError: createError({ statusCode: 404, message: `Page not found: ${req.path}` })
	}
}
