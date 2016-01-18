package polytech.gpsalzheimer;

/**
 * Created by Romain Guillot on 18/01/16.
 */
public enum ColorGPS {

    YELLOW(0, R.color.yellow), LIGHT_BLUE(1, R.color.lightblue), BLUE(2, R.color.blue), GREEN(3, R.color.green), VIOLET(4, R.color.violet), LIGHT_VIOLET(5, R.color.lightviolet), BROWN(6, R.color.brown);

    private final int value;
    private final int color;

    ColorGPS(int value, int color) {
        this.value = value;
        this.color = color;
    }

    public int getValue(){
        return this.value;
    }

    public int getColor(){
        return this.color;
    }

    public static ColorGPS fromId(int id) {

        for (ColorGPS type : ColorGPS.values()) {
            if (type.value == id) {
                return type;
            }
        }
        return null;
    }

}
