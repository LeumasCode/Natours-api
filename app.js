const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControllers');

const app = express();

// Limit request rate
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in an hour',
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XSS
app.use(xss());

// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'Price',
    ],
  })
);

// set security HTTP Header
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//serving static files
app.use(express.static(`${__dirname}/public`));
// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  // console.log(req.headers)
  next();
});
app.use((req, res, next) => {
  console.log('hello from middleware');
  next();
});

// route handler

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/Users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
