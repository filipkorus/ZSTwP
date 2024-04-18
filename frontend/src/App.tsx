import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import PrivateRoute from '@/components/routing/PrivateRoute';

import LoginPage from '@/pages/LoginPage';
import NotFound from '@/pages/errors/NotFound';
import DrawerView from '@/pages/DrawerView';
import RegisterPage from '@/pages/RegisterPage';

const App = () => {
	return <Router>
		<Routes>
			<Route path="/" element={<PrivateRoute/>}>
				<Route path="" element={
					<DrawerView pageTitle="Dashboard">
						<h1>Dashboard</h1>
					</DrawerView>
				}/>
			</Route>
			<Route path="/login" element={<LoginPage/>}/>
			<Route path="/register" element={<RegisterPage/>}/>
			<Route path="*" element={<NotFound/>}/>
		</Routes>
	</Router>;
}

export default App;
