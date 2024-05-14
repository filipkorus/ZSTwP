import React, {useState} from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import ListIcon from '@mui/icons-material/List';
import SidebarMenuItem from '@/components/sidebar/menu/SidebarMenuItem';
import {useAuth} from '@/context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {
	Avatar,
	Button,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
	Box,
} from '@mui/material';
import formatDate from '@/utils/date/formatDate';
import {useSidebar} from '@/context/SidebarContext';
import theme from '@/theme';

const SidebarMenu: React.FC = () => {
	const {currentUser, handleLogout} = useAuth();
	const navigate = useNavigate();
	const {isSidebarOpen} = useSidebar();

	const [loading, setLoading] = useState<boolean>(false);

	if (currentUser == null) return <></>;

	return (
		<Box display="flex" flexDirection="column" height="100%">
			<ListItem alignItems="flex-start">
				<ListItemAvatar>
					<Avatar alt={currentUser.name} src=""/>
				</ListItemAvatar>
				<ListItemText
					primary={currentUser.name}
					secondary={
						<Typography
							sx={{
								display: 'inline',
								textAlign: isSidebarOpen ? 'left' : 'center',
							}}
							component="span"
							variant="body2"
							color="text.primary"
						>
							since {formatDate(currentUser.joinedAt)}
						</Typography>
					}
				/>
			</ListItem>

			<SidebarMenuItem
				linkTo="#"
				text="Example nav link"
				title="Click me!"
				icon={<ListIcon/>}
			/>

			<Box mt={1}>
				<Button
					fullWidth
					style={{
						display: 'flex',
						color: theme.palette.primary.main,
						borderColor: theme.palette.primary.main,
						maxWidth: '95%',
						margin: '0 auto',
						textTransform: 'none',
					}}
					title="Log out"
					variant="outlined"
					onClick={() => {
						setLoading(true);

						handleLogout()
							.then(({success, error}) => {
								if (error) return alert(error);
								navigate('/login?loggedOut=true');
							})
							.finally(() => {
								setLoading(false);
							});
					}}
					disabled={loading}
				>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<LogoutIcon sx={{marginLeft: isSidebarOpen ? '5px' : '0'}}/>
						{isSidebarOpen && (
							<Typography
								sx={{
									display: 'inline',
									marginLeft: '5px',
								}}
							>
								Log out
							</Typography>
						)}
					</Box>
				</Button>
			</Box>
		</Box>
	);
};

export default SidebarMenu;
