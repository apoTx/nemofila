app.filter('range', () => {
	return function(input, min, max) {
		min = parseInt(min); //Make string input int
		max = parseInt(max);
		for (let i=min; i<max; i++)
			input.push(i);
		return input;
	};
});
