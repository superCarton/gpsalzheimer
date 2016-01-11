package polytech.gpsalzheimer;

import android.app.Fragment;
import android.app.FragmentManager;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.support.wearable.view.CardFragment;
import android.support.wearable.view.FragmentGridPagerAdapter;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Romain Guillot on 11/01/16.
 */
public class ElementGridPagerAdapter extends FragmentGridPagerAdapter {

    private List<Row> mRows = new ArrayList<Row>();
    private List<Element> mElements;

    public ElementGridPagerAdapter(List<Element> elements, FragmentManager fm) {
        super(fm);
        this.mElements = elements;

        //Construit le tableau des éléménts à afficher
        for (Element element : elements) {
            mRows.add(new Row(
                            //pour l'instant nous ne mettrons qu'un élément par ligne
                            CardFragment.create(element.getTitre(), element.getTexte())
                    )
            );
        }
    }

    //Le fragment à afficher p
    @Override
    public Fragment getFragment(int row, int col) {
        Row adapterRow = mRows.get(row);
        return adapterRow.getColumn(col);
    }

    //le drawable affichée en background pour la ligne [row]
    @Override
    public Drawable getBackgroundForRow(final int row) {
        return new ColorDrawable(mElements.get(row).getColor());
    }

    @Override
    public Drawable getBackgroundForPage(final int row, final int column) {
        //nous pouvons spécifier un drawable différent pour le swipe horizontal
        return getBackgroundForRow(row);
    }

    //Le nombre de lignes dans la grille
    @Override
    public int getRowCount() {
        return mRows.size();
    }

    //Le nombre de colonnes par ligne
    @Override
    public int getColumnCount(int rowNum) {
        return mRows.get(rowNum).getColumnCount();
    }

    /**
     * Représentation d'une ligne - Contient une liste de fragments
     */
    private class Row {
        final List<Fragment> columns = new ArrayList<Fragment>();
        public Row(Fragment... fragments) {
            for (Fragment f : fragments) {
                add(f);
            }
        }
        public void add(Fragment f) {
            columns.add(f);
        }
        Fragment getColumn(int i) {
            return columns.get(i);
        }
        public int getColumnCount() {
            return columns.size();
        }
    }
}