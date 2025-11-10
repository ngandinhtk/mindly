import express from 'express';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(routes);

// Serve static files from the React app
import path from 'path';
app.use(express.static(path.join(__dirname, '../../client/build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Mindly server listening on http://localhost:${PORT}`);
});

export default app;
