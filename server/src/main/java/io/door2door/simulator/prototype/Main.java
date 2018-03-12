package io.door2door.simulator.prototype;

import org.glassfish.tyrus.server.Server;

public class Main {

    public static void main(String[] args) throws Exception {
        new Server("localhost", 1234, "/",
                WebSocketClient.class).start();
        Thread.currentThread().join();
    }

}