package polytech.gpsalzheimer;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

/**
 * Created by Romain Guillot on 18/01/16.
 */
public class SocketGPS {

    private final String SOCKET_ADDR = "http://sparks-vm19.i3s.unice.fr/gpsalzheimer/smartphone";

    private com.github.nkzawa.socketio.client.Socket mSocket;

    private int smartphoneid;
    private ColorGPS color;

    private static SocketGPS ourInstance = new SocketGPS();

    private Context contextMain, contextConnected;

    public static SocketGPS getInstance() {
        return ourInstance;
    }

    private SocketGPS() {

        try {

            Log.i("socketio", "create socket");
            mSocket = IO.socket(SOCKET_ADDR);
        } catch (URISyntaxException e) {
            Log.i("socketio", "error create socket");
        }
    }

    public ColorGPS getColor(){
        return color;
    }

    public void connectServer(){
        if (!mSocket.connected()){

            Log.i("socketio", "connect server");

            mSocket.on("connectionAchieved", connectAchieve);
            mSocket.on("disconnectionAchieved", disconnectAchieve);

            mSocket.connect();
        }
    }

    public void disconnectServer(){
        if (mSocket.connected()){

            Log.i("socketio", "disconnect server");

            mSocket.disconnect();

            mSocket.off("connectionAchieved", connectAchieve);
            mSocket.off("disconnectionAchieved", disconnectAchieve);
        }
    }

    public void connectToTab(Context contextMain){

        if (mSocket.connected()) {

            Log.i("socketio", "connect tab emit");

            this.contextMain = contextMain;
            mSocket.emit("connectable", "{}");

        } else {
            Log.i("socketio", "error not connected");
        }
    }

    public void disconnectToTab(Context contextConnected){

        if (mSocket.connected()) {

            Log.i("socketio", "disconnect tab emit");

            this.contextConnected = contextConnected;
            mSocket.emit("disconnectable", "{id:" + smartphoneid + "}");

        } else {
            Log.i("socketio", "error not connected");
        }

    }


    private Emitter.Listener connectAchieve = new Emitter.Listener() {

        @Override
        public void call(final Object... args) {

            new Thread(new Runnable() {

                @Override
                public void run() {

                    Log.i("socketio", "connectAchieve");

                    JSONObject data = (JSONObject) args[0];

                    try {

                        color = ColorGPS.fromId(data.getInt("color"));
                        smartphoneid = data.getInt("id");

                    } catch (JSONException e) {
                        return;
                    }

                    // emit event that we are connected and waiting for the tab
                    Intent i = new Intent(Events.WAITING_TO_CONNECT_TAB);
                    contextMain.sendBroadcast(i);

                }

            }).start();
        }
    };

    private Emitter.Listener disconnectAchieve = new Emitter.Listener() {

        @Override
        public void call(final Object... args) {

            new Thread(new Runnable() {

                @Override
                public void run() {

                    Log.i("socketio", "disconnectAchieve");

                    // start the connected activity
                    Intent i = new Intent(contextConnected, MainActivity.class);
                    i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    contextConnected.startActivity(i);

                }

            }).start();
        }
    };


}
