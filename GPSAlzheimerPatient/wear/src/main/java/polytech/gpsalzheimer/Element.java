package polytech.gpsalzheimer;

public class Element {

    private String titre;
    private String texte;
    private int color;

    public Element(String titre, String texte, int color) {
        this.titre = titre;
        this.texte = texte;
        this.color = color;
    }

    public String getTitre(){
        return titre;
    }

    public String getTexte(){
        return texte;
    }

    public int getColor(){
        return color;
    }
}