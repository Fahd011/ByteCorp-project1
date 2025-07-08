import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import taxRoute from './routes/tax';
import benefitTypeRoutes from './routes/benefitTypes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount /users routes
app.use('/api/users', userRoutes);
app.use('/api/tax', taxRoute);
app.use('/api/benefit-types', benefitTypeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

