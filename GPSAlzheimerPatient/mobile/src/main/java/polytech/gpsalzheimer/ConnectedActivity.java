package polytech.gpsalzheimer;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ProgressBar;
import android.widget.TextView;

public class ConnectedActivity extends AppCompatActivity {

    private SocketGPS socketGPS;
    private ProgressBar progressBar;
    private TextView textView;
    private Button disconnectBtn;
    private BroadcastReceiver broadcastReceiver;

    public ConnectedActivity(){
        socketGPS = SocketGPS.getInstance();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_connected);


        disconnectBtn = (Button) findViewById(R.id.btnDisconnect);
        disconnectBtn.setEnabled(true);

        textView = (TextView) findViewById(R.id.textView);
        progressBar = (ProgressBar) findViewById(R.id.progressBar2);
        progressBar.setVisibility(View.INVISIBLE);

        textView.setText("Smartphone en attente de la tablette");
        textView.setBackgroundColor(getResources().getColor(socketGPS.getColor().getColor()));

    }

    public void disconnectToTab(View v){

        disconnectBtn.setEnabled(false);
        progressBar.setVisibility(View.VISIBLE);
        socketGPS.disconnectToTab(getApplicationContext());
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

    private void registerBroadcastReceivers() {

        // listening to the event waiting to connect
        broadcastReceiver = new BroadcastReceiver() {

            @Override
            public void onReceive(Context context, Intent intent) {
                textView.setText("Smartphone connecté");
            }
        };

        IntentFilter progressfilter = new IntentFilter(Events.ADDED_ON_TAB);
        registerReceiver(broadcastReceiver, progressfilter);
    }
}
