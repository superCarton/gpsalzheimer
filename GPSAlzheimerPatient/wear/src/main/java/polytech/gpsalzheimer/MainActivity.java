package polytech.gpsalzheimer;

import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.support.wearable.activity.WearableActivity;
import android.util.Log;
import android.widget.TextView;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.wearable.MessageApi;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.NodeApi;
import com.google.android.gms.wearable.Wearable;

import java.util.Random;

/**
 * The activity on the android wear
 * It displays the heart rate and send it to the smartphone connected
 *
 *  Created by Romain Guillot on 18/01/15
 */
public class MainActivity extends WearableActivity implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, MessageApi.MessageListener, SensorEventListener {

    private final static String PATH = "polytech.gpsalzheimer.frequency";
    private TextView mTextView;
    protected GoogleApiClient mApiClient;

    //Sensor and SensorManager
    Sensor mHeartRateSensor;
    SensorManager mSensorManager;

    private int heartFrequency;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        mTextView = (TextView) findViewById(R.id.text);

        // enable to go in ambiant mode : run all the time
        setAmbientEnabled();

        // Sensor and sensor manager
        mSensorManager = ((SensorManager)getSystemService(SENSOR_SERVICE));
        mHeartRateSensor = mSensorManager.getDefaultSensor(Sensor.TYPE_HEART_RATE);

        heartFrequency = 0;
    }

    /**
     * A l'ouverture, connecte la montre au Google API Client / donc au smartphone
     */
    @Override
    protected void onStart() {
        super.onStart();
        mApiClient = new GoogleApiClient.Builder(this)
                .addApi(Wearable.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();

        mApiClient.connect();
    }

    /**
     * A la fermeture de l'application, desactive le GoogleApiClient
     * Et ferme l'envoie de message
     */
    @Override
    protected void onStop() {
        if (null != mApiClient && mApiClient.isConnected()) {
            Wearable.MessageApi.removeListener(mApiClient, this);
            mApiClient.disconnect();
        }
        super.onStop();
    }

    @Override
    public void onConnectionSuspended(int i) {
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
    }

    /**
     * Envoie un message à au smartphone
     * @param path identifiant du message
     * @param message message à transmettre
     */
    protected void sendMessage(final String path, final String message) {
        //effectué dans un trhead afin de ne pas être bloquant
        new Thread(new Runnable() {
            @Override
            public void run() {
                //envoie le message à tous les noeuds/montres connectées
                final NodeApi.GetConnectedNodesResult nodes = Wearable.NodeApi.getConnectedNodes(mApiClient).await();
                for (Node node : nodes.getNodes()) {
                    Wearable.MessageApi.sendMessage(mApiClient, node.getId(), path, message.getBytes()).await();

                }
            }
        }).start();
    }

    @Override
    public void onConnected(Bundle bundle) {
        Wearable.MessageApi.addListener(mApiClient, this);

        //envoie le premier message
        sendMessage("bonjour", "smartphone");
    }

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        //traite le message reçu
        final String path = messageEvent.getPath();

        if(path.equals("bonjour")){

            //récupère le contenu du message
            final String message = new String(messageEvent.getData());

            //penser à effectuer les actions graphiques dans le UIThread
            runOnUiThread(new Runnable() {
                @Override
                public void run() {


                }
            });
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        //Register the listener
        if (mSensorManager != null){
            mSensorManager.registerListener(this, mHeartRateSensor, SensorManager.SENSOR_STATUS_ACCURACY_LOW);
            Log.i("HEART", "on resume");
        }
    }

    @Override
    protected void onPause() {
        Log.i("HEART", "on pause");
        super.onPause();
    }

    @Override
    protected void onDestroy(){

        //Unregister the listener
        if (mSensorManager!=null){
            mSensorManager.unregisterListener(this);
            Log.i("HEART", "on destroy");
        }
        super.onDestroy();
    }

    /**
     * Event that the heart frequency changed
     * @param event
     */
    @Override
    public void onSensorChanged(SensorEvent event) {

        //Update your data.
        if (event.sensor.getType() == Sensor.TYPE_HEART_RATE) {

            int newHeartFreq = (int) event.values[0];
            Log.i("HEART", "" + newHeartFreq);

            if (newHeartFreq != heartFrequency){
                heartFrequency = newHeartFreq;

                // send frequency to the smartphone
                sendMessage(PATH, "" + heartFrequency);

                // display it on the watch
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        mTextView.setText(String.valueOf(heartFrequency));
                    }
                });
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    /**
     * Fake method if the sensor is bad
     */
    private void generateNewRandomFrequency(){

        int min = 1;
        int max = 3;

        Random rand = new Random();
        int variation = rand.nextInt((max - min) + 1) + min;

        boolean variationSign = rand.nextBoolean();

        // if variationSign is true, add the variation
        if (variationSign){
            heartFrequency += variation;
        } else {
            heartFrequency -= variation;
        }

    }

}
