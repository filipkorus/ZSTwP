type User = {
	id: number;
	name: string;
	email: string;
	admin: boolean;
	banned: boolean;
	joinedAt: Date;
};

export default User;
