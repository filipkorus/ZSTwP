import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Alert, Box, Button, Container, Grid, FormGroup, TextField, LinearProgress, Snackbar} from '@mui/material';
import logo from '@/assets/logo.png';
import {useAuth} from '@/context/AuthContext';
import '@/styles/pages.css';
import useForm from '@/hooks/useForm';
import theme from '@/theme';
import RouterLink from '@/components/routing/RouterLink';
import ErrorFields from '@/types/ErrorFields';
import {register} from '@/api/auth';
import {AxiosError} from 'axios';

const LoginPage = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [successMessage, setSuccessMessage] = useState<string>('');
	const [errorFields, setErrorFields] = useState<ErrorFields>([]);

	const {currentUser} = useAuth();

	const {formData, handleInputChange, resetForm, setNewFormValues} = useForm({
		name: '',
		email: '',
		password: ''
	});

	const fieldError = (fieldName: keyof typeof formData) => errorFields.find(error => error.path[0] === fieldName);

	const location = useLocation();
	const query = new URLSearchParams(location.search);
	const navigate = useNavigate();

	// redirect authorized user from Register page
	useEffect(() => {
		if (currentUser == null) return;

		navigate(`/?${query.toString()}`);
	}, [currentUser]);

	const handleSubmit = async ({name, email, password}: typeof formData) => {
		setErrorMessage('');
		setSuccessMessage('');
		setLoading(true);

		register({name, email, password})
			.then(({data}) => {
				if (data?.success) {
					resetForm();
					setSuccessMessage(data?.msg ?? 'Account has been created');
				} else {
					setErrorMessage(data?.msg ?? 'Error. Try again');
				}
			})
			.catch(error => {
				if (!(error instanceof AxiosError)) return;

				setErrorFields(error?.response?.data?.errors ?? []);
				setErrorMessage(error?.response?.data?.msg ?? 'Server error');
			})
			.finally(() => {
				setLoading(false);
			});
	}

	return <>
		<Container maxWidth="xs" style={{height: '95vh', overflow: 'hidden'}}>
			{loading && currentUser == null && (
				<LinearProgress color="secondary" sx={{position: 'absolute', top: 0, left: 0, width: '100%'}}/>
			)}

			<Grid container direction="column" alignItems="center" justifyContent="center" height="100%">
				<div style={{textAlign: 'center'}}>
					<img className="logo-animation" src={logo} alt="logo" style={{width: '80%', maxWidth: '200px'}}/>
					<p style={{fontFamily: 'Brush Script MT, cursive', fontSize: '24px', color: '#960f5a'}}>
						----------hello world----------
					</p>
				</div>

				{errorMessage && currentUser == null && (
					<Box marginTop="2rem">
						<Alert severity="error">{errorMessage}</Alert>
					</Box>
				)}

				{successMessage && currentUser == null && (
					<Box marginTop="2rem">
						<Alert severity="success">{successMessage}</Alert>
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
								type="name"
								label="Your name"
								name="name"
								onChange={handleInputChange}
								disabled={loading}
								inputProps={{
									maxLength: 255,
								}}
								error={fieldError('name') != null}
								helperText={fieldError('name')?.message}
								value={formData.name}
								fullWidth
								sx={{mb: 2, mt: 1}}
							/>

							<TextField
								variant="outlined"
								required
								type="email"
								label="Email"
								name="email"
								onChange={handleInputChange}
								disabled={loading}
								inputProps={{
									maxLength: 255,
								}}
								error={fieldError('email') != null}
								helperText={fieldError('email')?.message}
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
								error={fieldError('password') != null}
								helperText={fieldError('password')?.message}
								value={formData.password}
								fullWidth
								sx={{mb: 2, mt: 1}}
							/>

							<Button variant="contained" type="submit" disabled={loading} fullWidth>
								Register in
							</Button>
						</FormGroup>
					</form>

					<RouterLink to="/login">
						<Button style={{color: theme.palette.primary.main, borderColor: theme.palette.primary.main}}
						        variant="outlined" sx={{marginTop: '3rem'}}
						        disabled={loading} fullWidth>
							Already have an account? Login here
						</Button>
					</RouterLink>
				</Box>
			</Grid>
		</Container>
	</>
};

export default LoginPage;
