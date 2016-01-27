package polytech.gpsalzheimer;

import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

/**
 * Created by Romain Guillot on 27/01/16.
 */
public class GPSLocationListener implements LocationListener {

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