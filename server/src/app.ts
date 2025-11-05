import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Mindly server listening on http://localhost:${PORT}`);
});

export default app;
