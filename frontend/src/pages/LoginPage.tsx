import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Alert, Box, Button, Container, Grid, FormGroup, TextField, LinearProgress, Snackbar} from '@mui/material';
import {useAuth} from '@/context/AuthContext';
import '@/styles/pages.css';
import useForm from '@/hooks/useForm';
import theme from '@/theme';
import RouterLink from '@/components/routing/RouterLink';
import Logo from '@/components/Logo';

const LoginPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>('');

	const {handleLogin, currentUser} = useAuth();

	const {formData, handleInputChange, setNewFormValues} = useForm({
		email: '',
		password: ''
	});

	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const navigate = useNavigate();

	const params = new URLSearchParams(window.location.search);
	const [isLoggedOut, setIsLoggedOut] = useState<boolean>(params.get('loggedOut') === 'true');
	const [isKickedOut, setIsKickedOut] = useState<boolean>(params.get('kickedOut') === 'true');

	// redirect authorized user from Login page
	useEffect(() => {
		if (currentUser == null) return;

		navigate(`/?${query.toString()}`);
	}, [currentUser]);

	const handleSubmit = async ({email, password}: typeof formData) => {
		setError('');
		setIsLoggedOut(false);
		setIsKickedOut(false);
		setLoading(true);

		const {success, error} = await handleLogin({email, password});

		// redirect authorized user to Dashboard page
		if (success) {
			return navigate('/');
		}


		setNewFormValues({...formData, password: ''}); // reset password input
		setError(error ?? 'Server error');
		setLoading(false);
	}

	return <>
		<Container maxWidth="xs" style={{height: '95vh', overflow: 'hidden'}}>
			{loading && currentUser == null && (
				<LinearProgress color="secondary" sx={{position: 'absolute', top: 0, left: 0, width: '100%'}}/>
			)}

			<Grid container direction="column" alignItems="center" justifyContent="center" height="100%">
				<Logo />

				{error && currentUser == null && (
					<Box marginTop="2rem">
						<Alert severity="error">{error}</Alert>
					</Box>
				)}

				<Box marginTop="2rem">
					<form onSubmit={
						(event: React.FormEvent<HTMLFormElement>) => {
							event.preventDefault();
							handleSubmit(formData);
						}
					}>
						<FormGroup>
							<TextField
								variant="outlined"
								required
								label="Email"
								name="email"
								type="email"
								onChange={handleInputChange}
								disabled={loading}
								inputProps={{
									maxLength: 255,
								}}
								value={formData.email}
								fullWidth
								sx={{mb: 2, mt: 1}}
							/>

							<TextField
								variant="outlined"
								required
								label="Password"
								name="password"
								type="password"
								onChange={handleInputChange}
								disabled={loading}
								inputProps={{
									minLength: 6,
									maxLength: 255,
								}}
								value={formData.password}
								fullWidth
								sx={{mb: 2, mt: 1}}
							/>

							<Button variant="contained" type="submit" disabled={loading} fullWidth>
								Log in
							</Button>
						</FormGroup>
					</form>

					<RouterLink to="/register">
						<Button style={{color: theme.palette.primary.main, borderColor: theme.palette.primary.main}}
						        variant="outlined" sx={{marginTop: '3rem'}}
						        disabled={loading} fullWidth>
							Do not have an account yet? Register here
						</Button>
					</RouterLink>
				</Box>
			</Grid>

			{currentUser == null && (
				<>
					<Snackbar open={isLoggedOut}>
						<Alert severity="success" onClose={() => setIsLoggedOut(false)}>
							Logged out successfully
						</Alert>
					</Snackbar>
					<Snackbar open={isKickedOut}>
						<Alert severity="warning" onClose={() => setIsKickedOut(false)}>
							Please log in
						</Alert>
					</Snackbar>
				</>
			)}
		</Container>

		{currentUser == null && <>
          <Snackbar open={isLoggedOut}>
              <Alert severity="success" onClose={() => setIsLoggedOut(false)}>Logged out successfully</Alert>
          </Snackbar>
          <Snackbar open={isKickedOut}>
              <Alert severity="warning" onClose={() => setIsKickedOut(false)}>Please log in</Alert>
          </Snackbar>
      </>}
	</>
};

export default LoginPage;
