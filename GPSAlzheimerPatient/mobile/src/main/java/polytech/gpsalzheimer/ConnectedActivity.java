package polytech.gpsalzheimer;

import android.app.AlertDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.LocationListener;
import android.location.LocationManager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
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
    private LocationListener locationListener;
    private LocationManager locationManager;

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

        textView.setText(getString(R.string.smartphone_waiting_tab));
        textView.setBackgroundColor(getResources().getColor(socketGPS.getColor().getColor()));

        // TODO delete it
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        locationListener = new GPSLocationListener();
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, locationListener);

        disconnectBtn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                Log.i("GPS", "Click on disconnect button");

                new AlertDialog.Builder(getBaseContext())
                        .setTitle(R.string.disconnect_confirm_title)
                        .setMessage(R.string.disconnect_confirm_message)
                        .setPositiveButton(R.string.disconnect_confirm_yes, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                Log.i("GPS", "Confirm exit");
                                disconnectToTab();
                            }
                        })
                        .setNegativeButton(R.string.disconnect_confirm_no, null)
                        .show();

            }
        });
    }

    public void disconnectToTab(){
        locationManager.removeUpdates(locationListener);
        locationListener = null;

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

                textView.setText(getString(R.string.smartphone_connected));

                // set the location listener
                // TODO uncomment it and delete in oncretae
               /* LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
                locationListener = new GPSLocationListener();
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, locationListener); */
            }
        };

        IntentFilter progressfilter = new IntentFilter(Events.ADDED_ON_TAB);
        registerReceiver(broadcastReceiver, progressfilter);
    }

}
