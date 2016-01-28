package polytech.gpsalzheimer;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.location.Location;
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

        // send the first position
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        final Location lastKnownLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);

        if (lastKnownLocation!=null){
            double latitude =  lastKnownLocation.getLatitude();
            double longitude =  lastKnownLocation.getLongitude();
            SocketGPS.getInstance().sendGPSData(latitude, longitude);
        }

        locationListener = new GPSLocationListener();
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 500, 0, locationListener); // each 500ms

        disconnectBtn.setOnClickListener(new View.OnClickListener() {

            @Override
            public void onClick(View v) {

                Log.i("GPS", "Click on disconnect button");

                new AlertDialog.Builder(ConnectedActivity.this)
                        .setTitle(R.string.disconnect_confirm_title)
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
    }

    @Override
    public void onStop(){

        super.onStop();
    }

    @Override
    protected void onDestroy(){

        SocketGPS.getInstance().disconnectToTab(this);
        super.onDestroy();
    }

    private class GPSLocationListener implements LocationListener {

        @Override
        public void onLocationChanged(Location loc) {

            double latitude =  loc.getLatitude();
            double longitude =  loc.getLongitude();

            SocketGPS.getInstance().sendGPSData(latitude, longitude);
        }

        @Override
        public void onProviderDisabled(String provider) {}

        @Override
        public void onProviderEnabled(String provider) {}

        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {}
    }


}
