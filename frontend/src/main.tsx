import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {ThemeProvider} from '@mui/material/styles';
import {SidebarProvider} from '@/context/SidebarContext';
import {AuthProvider} from '@/context/AuthContext';
import theme from '@/theme';
// import '@/styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ThemeProvider theme={theme}>
			<AuthProvider>
				<SidebarProvider>
					<App/>
				</SidebarProvider>
			</AuthProvider>
		</ThemeProvider>
	</React.StrictMode>,
);
