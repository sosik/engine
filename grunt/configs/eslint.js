module.exports = {
	eslint: {
		server: {
			src: ['src/server/SchemaConstants.js', 'src/server/SchemaTools.js']
		},
		client: {
			src: ['src/client/js/xpsui/filters/**/*.js', 'src/client/js/xpsui/services/form-generator.js', 'src/client/js/xpsui/directives/objectlink2-edit.js']
		},
		tests: {
			src: ['tests/unit/server/SchemaTools.js']
		}
	}
};
