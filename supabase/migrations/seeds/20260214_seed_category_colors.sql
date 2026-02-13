-- Update categories with colors and descriptions

-- React
UPDATE categories 
SET 
  color = '#61DAFB',
  description = 'Tutorial dan pembahasan mendalam tentang ekosistem React.js.'
WHERE slug = 'react';

-- Next.js
UPDATE categories 
SET 
  color = '#000000', -- Will be tinted in UI
  description = 'Panduan pengembangan aplikasi web modern dengan Next.js.'
WHERE slug = 'next-js';

-- TypeScript
UPDATE categories 
SET 
  color = '#3178C6',
  description = 'Tips dan trik menulis kode JavaScript yang lebih aman dengan TypeScript.'
WHERE slug = 'typescript';

-- CSS
UPDATE categories 
SET 
  color = '#264de4',
  description = 'Teknik styling modern, CSS Grid, Flexbox, dan Tailwind CSS.'
WHERE slug = 'css';

-- Accessibility
UPDATE categories 
SET 
  color = '#2c3e50',
  description = 'Membangun web yang inklusif dan dapat diakses oleh semua orang.'
WHERE slug = 'accessibility';

-- DevOps
UPDATE categories 
SET 
  color = '#e74c3c',
  description = 'CI/CD, deployment, server management, dan cloud infrastructure.'
WHERE slug = 'devops';

-- Database
UPDATE categories 
SET 
  color = '#8e44ad',
  description = 'Perancangan schema, optimasi query, dan manajemen database.'
WHERE slug = 'database';

-- Case Study
UPDATE categories 
SET 
  color = '#e67e22',
  description = 'Analisis mendalam dan pembelajaran dari proyek dunia nyata.'
WHERE slug = 'case-study';

-- Tutorial
UPDATE categories 
SET 
  color = '#2ecc71',
  description = 'Langkah demi langkah mempelajari teknologi baru.'
WHERE slug = 'tutorial';

-- Technical Opinion
UPDATE categories 
SET 
  color = '#95a5a6',
  description = 'Opini, pemikiran, dan prediksi seputar dunia software engineering.'
WHERE slug = 'opinion';
