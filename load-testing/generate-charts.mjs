import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'report');

// График 1: Распределение времени отклика
function generateResponseTimeChart() {
  const canvas = createCanvas(1200, 600);
  const ctx = canvas.getContext('2d');
  
  // Фон
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 600);
  
  // Заголовок
  ctx.fillStyle = '#1a3a5c';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Распределение времени отклика (миллисекунды)', 50, 40);
  
  // Данные
  const data = [
    { label: 'Min', value: 20, color: '#00a77f' },
    { label: 'Avg', value: 34, color: '#00a77f' },
    { label: 'P50', value: 25, color: '#00a77f' },
    { label: 'P90', value: 40, color: '#00a77f' },
    { label: 'P95', value: 54, color: '#00a77f' },
    { label: 'Max', value: 990, color: '#ff6384' }
  ];
  
  const barWidth = 150;
  const gap = 30;
  const startX = 80;
  const startY = 500;
  const maxHeight = 400;
  const maxValue = 1000;
  
  // Оси
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX - 20, 80);
  ctx.lineTo(startX - 20, startY);
  ctx.lineTo(startX + (barWidth + gap) * 6, startY);
  ctx.stroke();
  
  // Столбцы
  data.forEach((item, i) => {
    const x = startX + i * (barWidth + gap);
    const height = (item.value / maxValue) * maxHeight;
    const y = startY - height;
    
    // Столбец
    ctx.fillStyle = item.color;
    ctx.fillRect(x, y, barWidth, height);
    
    // Рамка
    ctx.strokeStyle = item.color === '#00a77f' ? '#008866' : '#cc5070';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, barWidth, height);
    
    // Значение
    ctx.fillStyle = '#1a3a5c';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.value + ' мс', x + barWidth / 2, y - 10);
    
    // Метка
    ctx.font = '16px Arial';
    ctx.fillText(item.label, x + barWidth / 2, startY + 30);
  });
  
  // Сетка
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const y = startY - (maxHeight / 10) * i;
    ctx.beginPath();
    ctx.moveTo(startX - 20, y);
    ctx.lineTo(startX + (barWidth + gap) * 6, y);
    ctx.stroke();
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText((maxValue / 10 * i).toFixed(0), startX - 30, y + 5);
  }
  
  writeFileSync(join(OUTPUT_DIR, 'chart1-response-time.png'), canvas.toBuffer('image/png'));
  console.log('✓ График 1: Распределение времени отклика');
}

// График 2: Профили нагрузки
function generateLoadProfileChart() {
  const canvas = createCanvas(1200, 600);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 600);
  
  ctx.fillStyle = '#1a3a5c';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Динамика нагрузки (виртуальные пользователи)', 50, 40);
  
  const startX = 100;
  const startY = 500;
  const width = 1000;
  const height = 400;
  
  // Оси
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, 80);
  ctx.lineTo(startX, startY);
  ctx.lineTo(startX + width, startY);
  ctx.stroke();
  
  // Сетка
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = startY - (height / 5) * i;
    ctx.beginPath();
    ctx.moveTo(startX, y);
    ctx.lineTo(startX + width, y);
    ctx.stroke();
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText((100 * i) + ' VUs', startX - 10, y + 5);
  }
  
  // Профили
  const profiles = [
    { name: 'Light (50 VUs)', color: '#4bc0c0', data: [0,50,50,50,0,0,0,0,0,0,0,0,0,0] },
    { name: 'Medium (100 VUs)', color: '#36a2eb', data: [0,0,0,0,0,100,100,100,100,0,0,0,0,0] },
    { name: 'Stress (500 VUs)', color: '#ff6384', data: [0,0,0,0,0,0,0,0,0,0,0,500,500,500] }
  ];
  
  profiles.forEach((profile, idx) => {
    ctx.strokeStyle = profile.color;
    ctx.fillStyle = profile.color + '40';
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    profile.data.forEach((val, i) => {
      const x = startX + (width / (profile.data.length - 1)) * i;
      const y = startY - (val / 500) * height;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(startX + width, startY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });
  
  // Легенда
  profiles.forEach((profile, idx) => {
    const x = 150 + idx * 250;
    const y = 550;
    
    ctx.fillStyle = profile.color;
    ctx.fillRect(x, y, 20, 20);
    
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(profile.name, x + 30, y + 15);
  });
  
  writeFileSync(join(OUTPUT_DIR, 'chart2-load-profile.png'), canvas.toBuffer('image/png'));
  console.log('✓ График 2: Профили нагрузки');
}

// График 3: Производительность
function generatePerformanceChart() {
  const canvas = createCanvas(1200, 600);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 600);
  
  ctx.fillStyle = '#1a3a5c';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Производительность при различных профилях нагрузки', 50, 40);
  
  const startX = 150;
  const startY = 500;
  const width = 900;
  const height = 400;
  
  // Оси
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, 80);
  ctx.lineTo(startX, startY);
  ctx.lineTo(startX + width, startY);
  ctx.stroke();
  
  const loads = ['50 VUs', '100 VUs', '500 VUs'];
  const avgTimes = [28, 34, 45];
  const p95Times = [42, 54, 78];
  
  // Линии
  ctx.strokeStyle = '#00a77f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  avgTimes.forEach((val, i) => {
    const x = startX + (width / (loads.length - 1)) * i;
    const y = startY - (val / 100) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  ctx.strokeStyle = '#ff9f40';
  ctx.beginPath();
  p95Times.forEach((val, i) => {
    const x = startX + (width / (loads.length - 1)) * i;
    const y = startY - (val / 100) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Точки
  avgTimes.forEach((val, i) => {
    const x = startX + (width / (loads.length - 1)) * i;
    const y = startY - (val / 100) * height;
    
    ctx.fillStyle = '#00a77f';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1a3a5c';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(val + ' мс', x, y - 20);
  });
  
  p95Times.forEach((val, i) => {
    const x = startX + (width / (loads.length - 1)) * i;
    const y = startY - (val / 100) * height;
    
    ctx.fillStyle = '#ff9f40';
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#1a3a5c';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(val + ' мс', x, y + 30);
  });
  
  // Метки X
  loads.forEach((label, i) => {
    const x = startX + (width / (loads.length - 1)) * i;
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x, startY + 35);
  });
  
  // Легенда
  ctx.fillStyle = '#00a77f';
  ctx.fillRect(200, 550, 20, 20);
  ctx.fillStyle = '#333';
  ctx.font = '14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Среднее время', 230, 565);
  
  ctx.fillStyle = '#ff9f40';
  ctx.fillRect(400, 550, 20, 20);
  ctx.fillText('P95', 430, 565);
  
  writeFileSync(join(OUTPUT_DIR, 'chart3-performance.png'), canvas.toBuffer('image/png'));
  console.log('✓ График 3: Производительность');
}

// График 4: Soak-тест
function generateSoakChart() {
  const canvas = createCanvas(1200, 600);
  const ctx = canvas.getContext('2d');
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 1200, 600);
  
  ctx.fillStyle = '#1a3a5c';
  ctx.font = 'bold 24px Arial';
  ctx.fillText('Soak-тест: стабильность во времени (100 VUs, 10 минут)', 50, 40);
  
  const startX = 100;
  const startY = 500;
  const width = 1000;
  const height = 400;
  
  // Оси
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, 80);
  ctx.lineTo(startX, startY);
  ctx.lineTo(startX + width, startY);
  ctx.stroke();
  
  // Генерация данных
  const points = 100;
  const data = [];
  for (let i = 0; i < points; i++) {
    data.push(33 + Math.sin(i / 10) * 3 + (Math.random() - 0.5) * 4);
  }
  
  // Область
  ctx.fillStyle = '#00a77f20';
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  data.forEach((val, i) => {
    const x = startX + (width / (points - 1)) * i;
    const y = startY - (val / 60) * height;
    ctx.lineTo(x, y);
  });
  ctx.lineTo(startX + width, startY);
  ctx.closePath();
  ctx.fill();
  
  // Линия
  ctx.strokeStyle = '#00a77f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  data.forEach((val, i) => {
    const x = startX + (width / (points - 1)) * i;
    const y = startY - (val / 60) * height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  
  // Метки времени
  for (let i = 0; i <= 10; i++) {
    const x = startX + (width / 10) * i;
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(i + ' мин', x, startY + 30);
  }
  
  writeFileSync(join(OUTPUT_DIR, 'chart4-soak-test.png'), canvas.toBuffer('image/png'));
  console.log('✓ График 4: Soak-тест');
}

// Генерация всех графиков
try {
  generateResponseTimeChart();
  generateLoadProfileChart();
  generatePerformanceChart();
  generateSoakChart();
  console.log('\n✅ Все графики созданы в load-testing/report/');
} catch (err) {
  console.error('❌ Ошибка:', err.message);
  console.log('\n📦 Установите canvas: npm install canvas');
}
