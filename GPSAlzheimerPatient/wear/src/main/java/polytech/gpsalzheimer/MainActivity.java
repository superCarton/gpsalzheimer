package polytech.gpsalzheimer;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.support.wearable.view.DotsPageIndicator;
import android.support.wearable.view.GridViewPager;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.wearable.MessageApi;
import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.NodeApi;
import com.google.android.gms.wearable.Wearable;

import java.util.ArrayList;
import java.util.List;

public class MainActivity extends Activity  implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, MessageApi.MessageListener{

    private GridViewPager pager;
    private DotsPageIndicator dotsPageIndicator;

    //la liste des éléments à afficher
    private List<Element> elementList;

    protected GoogleApiClient mApiClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        pager = (GridViewPager) findViewById(R.id.pager);
        dotsPageIndicator = (DotsPageIndicator) findViewById(R.id.page_indicator);
        dotsPageIndicator.setPager(pager);

        elementList = creerListElements();

        pager.setAdapter(new ElementGridPagerAdapter(elementList, getFragmentManager()));
    }

    /**
     * Créé une liste d'éléments pour l'affichage
     */
    private List<Element> creerListElements() {
        List<Element> list = new ArrayList<>();

        list.add(new Element("Element 1", "Description 1", Color.parseColor("#F44336")));
        list.add(new Element("Element 2","Description 2", Color.parseColor("#E91E63")));
        list.add(new Element("Element 3","Description 3", Color.parseColor("#9C27B0")));
        list.add(new Element("Element 4", "Description 4", Color.parseColor("#673AB7")));
        list.add(new Element("Element 5","Description 5", Color.parseColor("#3F51B5")));
        list.add(new Element("Element 6", "Description 6", Color.parseColor("#2196F3")));

        return list;
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
        sendMessage("bonjour","smartphone");
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
                    //nous affichons ici dans notre viewpager
                    elementList = new ArrayList<>();
                    elementList.add(new Element("Message reçu",message,Color.parseColor("#F44336")));
                    pager.setAdapter(new ElementGridPagerAdapter(elementList,getFragmentManager()));
                }
            });
        }
    }

}