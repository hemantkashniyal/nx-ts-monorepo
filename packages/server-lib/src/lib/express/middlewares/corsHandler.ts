import cors from 'cors';

export function getCorseHandler(corsOptions: cors.CorsOptions = {}) {
  const localCorsOptions: cors.CorsOptions = {
    ...corsOptions,
    origin: ['*'],
    // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  };

  return cors(localCorsOptions);
}
