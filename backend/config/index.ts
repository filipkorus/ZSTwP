import 'dotenv/config';
import checkObjectValuesNotNull from '../src/utils/checkObjectValuesNotNull';

const config = {
	PRODUCTION: process.env.PRODUCTION === 'true' ?? true,
	PORT: process.env.PORT ?? 5001,
	ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(';') ?? [],
	LOGGER: {
		LEVEL: process.env.LOG_LEVEL ?? 'debug',
		SAVE_TO_FILE: false,
		FILE: 'app.log'
	},
	APP: {
		PAGINATION: {
			DEFAULT_PAGE_MIN: 1,
			DEFAULT_LIMIT_MAX: 3,
			MAX_LIMIT_MAX: 25
		}
	},
	DATABASE_URL: process.env.DATABASE_URL,
	MAX_NUM_FILES_TO_UPLOAD: 25,
	FILE_UPLOAD_LOCATION: process.env.FILE_UPLOAD_LOCATION,
	PDF_ANALYZER_API_URL: process.env.PDF_ANALYZER_API_URL,
	JWT: {
		ACCESS_TOKEN: {
			SECRET: 'q1j23_dnej823y_h2s8427vf134k_94_k2d4',
			EXPIRES_IN: '10m'
		},
		REFRESH_TOKEN: {
			SECRET: 'fsdf31b52n3tsdxf83_2jsddm2g9qgey3g',
			EXPIRES_IN_DAYS: 7
		},
	},
	TEST: {
		USER_ID: 1,
		ACCESS_TOKEN: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
	}
} as const;

const checkConfigFields = (): Promise<string> => {
	const nullConfigFieldPath = checkObjectValuesNotNull(config);

	if (typeof nullConfigFieldPath === 'string') {
		return Promise.reject(`config field (config.${nullConfigFieldPath}) is null or undefined`);
	}

	return Promise.resolve('checking config values: OK');
}

export {checkConfigFields};

export default config;
