require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const appRoutes = require('./routes/app');
const uploadRoutes = require('./routes/upload');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, name: 'PRIME API' }));
app.use('/api/auth', authRoutes);
app.use('/api/site', require('./routes/site'));
app.use('/api/admin', adminRoutes);
app.use('/api/admin', require('./routes/site-admin'));
app.use('/api/admin', require('./routes/rbac'));
app.use('/api/admin', require('./routes/admin-scoring'));
app.use('/api/admin/parents', require('./routes/parents-admin'));
app.use('/api/app', appRoutes);
app.use('/api/app/parent', require('./routes/parent'));
app.use('/api/scoring', require('./routes/scoring'));
app.use('/api/upload', uploadRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Серверийн алдаа' });
});

const port = Number(process.env.PORT || 3151);

sequelize
  .authenticate()
  .then(() => sequelize.sync({ alter: true }))
  .then(() => require('./services/productCategoryService').ensureProductCategories())
  .then(() => {
    app.listen(port, () => {
      console.log(`PRIME API running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
