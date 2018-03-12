package io.door2door.simulator.prototype;

import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;

import javax.websocket.OnMessage;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;

@ServerEndpoint(value = "/")
public class WebSocketClient {

    private JSONArray events;

    public WebSocketClient() {
        try {
            events = (JSONArray) new JSONParser().parse(new InputStreamReader(
                    Thread.currentThread().getContextClassLoader().getResourceAsStream("events.json"),
                    Charset.forName("utf-8")));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) throws IOException {
        if ("start_simulation".equals(message)) {
            for (Object event : events) {
                session.getBasicRemote().sendText(event.toString());
            }
        }
    }

}
