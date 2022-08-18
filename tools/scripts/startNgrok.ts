import * as ngrok from "ngrok";

(async () => {
  const ngrokConfig = {
    authtoken: process.env.NGROK_API_KEY,
  };
  console.log("Starting Ngrok");
  const url = await ngrok.connect({
    addr: 4200,
    host: "localhost",
    host_header: 4200,
    ...ngrokConfig,
  });
  console.log(url);
})();
