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

    //private final String SOCKET_ADDR = "http://10.212.103.206:3000/smartphone";
   private final String SOCKET_ADDR = "http://sparks-vm19.i3s.unice.fr/gpsalzheimer/smartphone";
    //private final String SOCKET_ADDR = "http://192.168.1.4:3000/smartphone";

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

            smartphoneid = -1;

            IO.Options opts = new IO.Options();
            opts.path = "/gpsalzheimer/socket.io";

            mSocket = IO.socket(SOCKET_ADDR, opts);
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

            this.contextConnected = contextConnected;

            JSONObject json = new JSONObject();
            try {
                json.put("id", smartphoneid);
                mSocket.emit("disconnectable", json);
                Log.i("socketio", "disconnect tab emit");

            } catch (JSONException e) {
                e.printStackTrace();
            }

        } else {
            Log.i("socketio", "error not connected");
        }
    }

    public void sendGPSData(double latitude, double longitude){

        if (mSocket.connected()) {

            if (smartphoneid != -1){


                JSONObject json = new JSONObject();

                try {
                    json.put("id", smartphoneid);
                    json.put("lat", latitude);
                    json.put("long", longitude);

                    mSocket.emit("gpsData", json);
                    Log.i("socketio", "gpsData emit (lat:" + latitude + ", long:" + longitude + ")");
                } catch (JSONException e) {
                    e.printStackTrace();
                }



            } else {
                Log.i("socketio", "gpsData not emit smartphone not connected");
            }

        } else {
            Log.i("socketio", "error not connected");
        }
    }

    public void sendFreqData(double freq){

        if (mSocket.connected()) {

            if (smartphoneid != -1) {

                JSONObject json = new JSONObject();
                try {
                    json.put("id", smartphoneid);
                    json.put("freq", freq);
                    mSocket.emit("frequencyData", json);
                    Log.i("socketio", "frequencyData emit " + freq);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

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

                        Log.i("socketio", "My ID is " + smartphoneid);

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

                    smartphoneid = -1;

                    // start the connected activity
                    Intent i = new Intent(contextConnected, MainActivity.class);
                    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    contextConnected.startActivity(i);

                }

            }).start();
        }
    };

    private Emitter.Listener addedOnTab = new Emitter.Listener() {

        @Override
        public void call(final Object... args) {

            new Thread(new Runnable() {

                @Override
                public void run() {

                    Log.i("socketio", "addedOnTab");

                    // emit event that the tab is also connected
                    Intent i = new Intent(Events.ADDED_ON_TAB);
                    contextMain.sendBroadcast(i);

                }

            }).start();
        }
    };


}
