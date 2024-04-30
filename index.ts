const log = (msg: string) => console.log(`[${new Date().toLocaleTimeString()}] ${msg}`);

const loadData = async () => {
  const file = Bun.file('data.json');
  if (!(await file.exists())) return {};
  const data = await file.text();
  return JSON.parse(data);
};

const saveData = async (data: any) => await Bun.write('data.json', JSON.stringify(data));;

let data = await loadData();
const server = Bun.serve({
  port: 3003,
  fetch: (req, server) => {
    if (server.upgrade(req)) return;
    return new Response('Upgrade Failed', { status: 500 });
  },
  websocket: {
    open: (ws) => { log('New connection'); ws.send(JSON.stringify(data)); ws.subscribe('data'); },
    close: (ws) => { log('Connection closed'); ws.unsubscribe('data'); },
    message: (_, msg) => {
      const { action, payload } = JSON.parse(msg.toString());
      switch (action) {
        case 'stop':
          return handleStop();
        case 'update':
          return handleUpdate(payload);
      }
    }
  }
});

const handleStop = () => { saveData(data); server.stop(true); };

const handleUpdate = (payload: object) => {
  log(`Data Updated: ${JSON.stringify(payload)}`);
  data = payload;
  server.publish('data', JSON.stringify(data));
};
