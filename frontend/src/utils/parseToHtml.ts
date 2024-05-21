const parseToHtml = (context: string): string => {
	const sections = context.split("\n\n### ").filter(section => section.trim() !== "");
	let html = "";

	sections.forEach(section => {
		const lines = section.split("\n").filter(line => line.trim() !== "");

		if (lines.length === 0) return;

		// The first line is the section title
		const sectionTitle = lines[0].replace("### ", "").trim();
		html += `<h2>${sectionTitle}</h2>`;

		let listOpen = false;

		lines.slice(1).forEach(line => {
			if (line.match(/^\d+\.\s/)) {
				if (listOpen) {
					html += "</ul>";
					listOpen = false;
				}
				const subSectionTitle = line.trim().replace(/^\d+\.\s/, "");
				html += `<h3>${subSectionTitle}</h3>`;
			} else if (line.startsWith("- ")) {
				if (!listOpen) {
					html += "<ul>";
					listOpen = true;
				}
				html += `<li>${line.replace("- ", "").trim()}</li>`;
			}
		});

		if (listOpen) {
			html += "</ul>";
		}
	});

	return html;
}

export default parseToHtml;
