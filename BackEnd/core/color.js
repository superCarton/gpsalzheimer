/**
 * Created by guillaume on 18/01/2016.
 */

/**
 * This function is a color maker.
 * It makes unique color id.
 */
function* colorMaker () {
    var colorId = 0;
    while (colorId >= 0)
        yield colorId++;
}

module.exports = colorMaker;