export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    let message = err.message;

    if(err.name === 'ValidationError') {
        statusCode = 400;
        const errors = Object.values(err.errors)
        .map((val) => val.message);
        message = `Validation Error: ${errors.join(', ')}`;
    }

    res.status(statusCode).json({
        message,
        stack: err.stack
    });
};