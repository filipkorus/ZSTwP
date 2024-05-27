import React from 'react';
// import logo from '@/assets/logo.png';

type LogoProps = React.ComponentProps<"div">;

const Logo: React.FC<LogoProps> = ({...rest}) => {
	return <div style={{textAlign: 'center'}} {...rest}>
		{/*<img className="logo-animation" src={logo} alt="logo" style={{width: '80%', maxWidth: '200px'}}/>*/}
		<p style={{fontFamily: 'Brush Script MT, cursive', fontSize: '24px', color: '#960f5a'}}>
			----------bamafial----------
		</p>
	</div>;
};

export default Logo;
