import {Typography} from '@mui/material';

const Dashboard = () => {

	return <>
		<h1>Wprowadzenie do projektu</h1>
		<Typography>
			Projekt Bamafial dotyczy wykorzystania mechanizmów ChatGPT do opracowania podsumowania zakresu zapytania ofertowego (presales briefing). Aplikacja webowa analizuje wprowadzone dokumenty przetargowe (podane w formacie .pdf) i na ich podstawie generuje podsumowanie zgodne z określonymi szablonami. Korzystając z odpowiednich zapytań oraz odniesień do bazowego dokumentu. Aplikacja zwraca podsumowanie pliku, który użytkownik wprowadza na wejście. Dzięki temu można szybko ocenić zgodność zapytania ofertowego z ofertą produktów i usług danej organizacji.
		</Typography>
	</>;
};

export default Dashboard;
