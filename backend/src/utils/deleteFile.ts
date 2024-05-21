import path from 'path';
import fs from 'fs/promises';
import logger from './logger';

const deleteFile = async (filePath: string) => {
	try {
		const resolvedPath = path.resolve(filePath);
		await fs.unlink(resolvedPath);
	} catch (error) {
		logger.error(`Error deleting the file: ${error}`);
	}
};

export default deleteFile;
