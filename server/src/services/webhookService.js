/**
 * Manages SSE clients and webhook event broadcasting.
 * Singleton pattern to share state across the application.
 */
class WebhookService {
  constructor() {
    this.clients = new Set();
  }

  addClient(res) {
    this.clients.add(res);
    console.log(`SSE client connected (total: ${this.clients.size})`);
  }

  removeClient(res) {
    this.clients.delete(res);
    console.log(`SSE client disconnected (total: ${this.clients.size})`);
  }

  broadcast(payload) {
    const data = JSON.stringify(payload);
    let sentCount = 0;

    for (const client of this.clients) {
      try {
        client.write(`event: webhook\ndata: ${data}\n\n`);
        sentCount++;
      } catch (err) {
        console.error('Failed to send SSE to a client:', err.message);
        this.clients.delete(client);
      }
    }

    console.log(`Webhook event forwarded to ${sentCount} SSE client(s)`);
    return sentCount;
  }

  getClientCount() {
    return this.clients.size;
  }
}

export default new WebhookService();
