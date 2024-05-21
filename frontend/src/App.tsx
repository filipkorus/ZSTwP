import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import PrivateRoute from '@/components/routing/PrivateRoute';

import LoginPage from '@/pages/LoginPage';
import NotFound from '@/pages/errors/NotFound';
import DrawerView from '@/pages/DrawerView';
import RegisterPage from '@/pages/RegisterPage';
import Dashboard from '@/pages/Dashboard';
import MyInquiresPage from '@/pages/MyInquiresPage';
import CreateInquiryPage from '@/pages/CreateInquiryPage';
import InquiryPage from '@/pages/InquiryPage.tsx';

const App = () => {
	return <Router>
		<Routes>
			<Route path="/" element={<PrivateRoute/>}>
				<Route path="" element={
					<DrawerView pageTitle="Dashboard">
						<Dashboard />
					</DrawerView>
				}/>

				<Route path="inquires" element={
					<DrawerView pageTitle="Your Inquires">
						<MyInquiresPage />
					</DrawerView>
				}/>

				<Route path="inquiry/:id" element={
					<DrawerView pageTitle="Inquiry">
						<InquiryPage />
					</DrawerView>
				}/>

				<Route path="new-inquiry" element={
					<DrawerView pageTitle="New Inquiry">
						<CreateInquiryPage />
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
