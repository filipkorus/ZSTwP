const removePolishChars = (input: string): string => {
	const polishToNormalMap: { [key: string]: string } = {
		'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z',
		'Ą': 'A', 'Ć': 'C', 'Ę': 'E', 'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z'
	};

	return input.split('').map(char => polishToNormalMap[char] || char).join('');
}

export default removePolishChars;
