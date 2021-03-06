package polytech.gpsalzheimer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;


/**
 * THe main activity is the activity when the user start the app
 * It allows to connect the smartphone to the server
 */
public class MainActivity extends AppCompatActivity {

    private SocketGPS socketGPS;
    private ProgressBar progressBar;
    private Button connectBtn;
    private BroadcastReceiver broadcastReceiver;

    public MainActivity(){
        socketGPS = SocketGPS.getInstance();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        connectBtn = (Button) findViewById(R.id.btnConnect);
        connectBtn.setEnabled(true);

        progressBar = (ProgressBar) findViewById(R.id.progressBar);
        progressBar.setVisibility(View.INVISIBLE);

        socketGPS.connectServer();
    }

    @Override
    public void onResume(){

        super.onResume();
        registerBroadcastReceivers();
    }

    @Override
    public void onStop(){

        unregisterReceiver(broadcastReceiver);
        super.onStop();
    }


    public void connectToTab(View v){

        connectBtn.setEnabled(false);
        progressBar.setVisibility(View.VISIBLE);
        socketGPS.connectToTab(getApplicationContext());

    }

    private void registerBroadcastReceivers() {

        // listening to the event waiting to connect
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context context, Intent intent) {

                // go to connected activity
                Intent i = new Intent(MainActivity.this, ConnectedActivity.class);
                startActivity(i);
            }
        };

        IntentFilter progressfilter = new IntentFilter(Events.WAITING_TO_CONNECT_TAB);
        registerReceiver(broadcastReceiver, progressfilter);

    }

}
