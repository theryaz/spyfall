import express from 'express';
import { logger } from './shared';

import App from './app';

const PORT = process.env.PORT || 4280;

logger.debug("App Listening on port " + PORT);
App.listen(PORT);