import cors from 'cors';

// TODO: update cors
const corsOptions: cors.CorsOptions = {
  origin: ['*'],
  // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
};

export const corsHandler = cors(corsOptions);
