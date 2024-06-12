/**
This library is based on mkfilter.c by Anthony J. Fisher, University of York, September 1992.
see:
http://www-users.cs.york.ac.uk/~fisher/mkfilter
https://github.com/university-of-york/cs-www-users-fisher
*/

/**
 * Enumeration containing available filter types.
 */
export const FilterType =
{
    Lowpass: "Lowpass",
    Highpass: "Highpass",
    Bandpass: "Bandpass",
    Notch: "Notch"
}

/**
 * Filter coefficients
 */
export class FilterCoefficients {
    a;
    b;

    /**
     * Initializes a new instance of @see FilterCoefficient.
     * @param a a coefficients.
     * @param b b coefficients.
     */
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
}

/**
 * Class to calculate Butterworth IIR filter coefficients.
 */
export class Butterworth {

    //#region  private members...

    #Cmone = new Complex(-1.0, 0.0);
    #Czero = new Complex(0.0, 0.0);
    #Cone = new Complex(1.0, 0.0);
    #Ctwo = new Complex(2.0, 0.0);
    #Chalf = new Complex(0.5, 0.0);

    //#endregion

    //#region  public members...

    Coefficients;

    //#endregion

    /**
     * Initializes a new instance of @see Butterworth.
     * @param samplingRate The sampling rate of the signal.
     * @param type Parameter to select the filter behavior @see FilterType.
     * @param order The filter order.
     * @param cutoffFrequencies An array with one filter cutoff frequency for @see FilterType.Highpass and @see FilterType.Lowpass. An array with two filter cutoff frequencies for @type FilterType.Bandpass and @type FilterType.Notch.
     */
    constructor(samplingRate, type, order, cutoffFrequencies) {
        var cutoffLow = -1;
        var cutoffHigh = -1;
        if ((type == FilterType.Lowpass || type == FilterType.Highpass) && cutoffFrequencies.length != 1)
            throw new Error("Only one cutoff frequency allowed for low- and highpass filters.");

        if ((type == FilterType.Bandpass || type == FilterType.Notch) && cutoffFrequencies.length != 2)
            throw new Error("Two cutoff frequencies required for bandpass and notch filters.");

        var cutoffLow = cutoffFrequencies[0];
        if (type == FilterType.Bandpass || type == FilterType.Notch)
            var cutoffHigh = cutoffFrequencies[1];

        if ((type == FilterType.Bandpass || type == FilterType.Notch) && cutoffLow >= cutoffHigh)
            throw new Error("Lower cutoff frequency mut be lower than higher cutoff frequency");

        if ((type == FilterType.Lowpass || type == FilterType.Highpass) && cutoffHigh != -1)
            throw new Error("Only lower cutoff frequency must be set for low- or highpass filter types.");

        if ((type == FilterType.Lowpass || type == FilterType.Highpass) && cutoffLow > samplingRate / 2)
            throw new Error("Cutoff must be lower than half of the sampling rate.");

        if ((type == FilterType.Bandpass || type == FilterType.Notch) && (cutoffLow > samplingRate / 2 || cutoffHigh > samplingRate / 2))
            throw new Error("Cutoff must be lower than half of the sampling rate.");

        //set defaults
        var numpoles = 0;

        var size = 0;
        if (type == FilterType.Bandpass || type == FilterType.Notch)
            size = 2 * order;
        else
            size = order;

        var spoles = new Array(size);
        var zpoles = new Array(size);
        var zzeros = new Array(size);

        //compute s
        for (var i = 0; i < 2 * order; i++) {
            var s = new Complex(0.0, (order & 1) == 1 ? (i * Math.PI) / order : ((i + 0.5) * Math.PI) / order);
            var z = this.#cexp(s);
            if (z.Real < 0.0)
                spoles[numpoles++] = z;
        }

        //normalize
        var rawAlpha1 = 0.0;
        var rawAlpha2 = 0.0;
        rawAlpha1 = cutoffLow / samplingRate;
        if (type == FilterType.Bandpass || type == FilterType.Notch)
            rawAlpha2 = cutoffHigh / samplingRate;
        else
            rawAlpha2 = rawAlpha1;

        var warpedAlpha1 = Math.tan(Math.PI * rawAlpha1) / Math.PI;
        var warpedAlpha2 = Math.tan(Math.PI * rawAlpha2) / Math.PI;

        var w1 = new Complex(2.0 * Math.PI * warpedAlpha1, 0.0);
        var w2 = new Complex(2.0 * Math.PI * warpedAlpha2, 0.0);
        var w0 = this.#Czero;
        var bw = this.#Czero;

        switch (type) {
            case FilterType.Lowpass:
                for (var i = 0; i < numpoles; i++)
                    spoles[i] = this.#cmul(spoles[i], w1);
                break;

            case FilterType.Highpass:
                for (var i = 0; i < numpoles; i++)
                    spoles[i] = this.#cdiv(w1, spoles[i]);
                break;

            case FilterType.Bandpass:
                w0 = this.#csqrt(this.#cmul(w1, w2));
                bw = this.#csub(w2, w1);
                for (var i = 0; i < numpoles; i++) {
                    var hba = this.#cmul(this.#Chalf, this.#cmul(spoles[i], bw));
                    var temp = this.#cdiv(w0, hba);
                    temp = this.#csqrt(this.#csub(this.#Cone, this.#cmul(temp, temp)));
                    spoles[i] = this.#cmul(hba, this.#cadd(this.#Cone, temp));
                    spoles[numpoles + i] = this.#cmul(hba, this.#csub(this.#Cone, temp));
                }
                numpoles *= 2;
                break;

            case FilterType.Notch:
                w0 = this.#csqrt(this.#cmul(w1, w2));
                bw = this.#csub(w2, w1);
                for (var i = 0; i < numpoles; i++) {
                    var hba = this.#cmul(this.#Chalf, this.#cdiv(bw, spoles[i]));
                    var temp = this.#cdiv(w0, hba);
                    temp = this.#csqrt(this.#csub(this.#Cone, this.#cmul(temp, temp)));
                    spoles[i] = this.#cmul(hba, this.#cadd(this.#Cone, temp));
                    spoles[numpoles + i] = this.#cmul(hba, this.#csub(this.#Cone, temp));
                }
                numpoles *= 2;
                break;

            default:
                throw new Error("Unknown filter type");
        }

        //compute z
        for (var i = 0; i < numpoles; i++) {
            var top = this.#cadd(this.#Ctwo, spoles[i]);
            var bot = this.#csub(this.#Ctwo, spoles[i]);
            zpoles[i] = this.#cdiv(top, bot);
            switch (type) {
                case FilterType.Lowpass:
                    zzeros[i] = this.#Cmone;
                    break;
                case FilterType.Highpass:
                    zzeros[i] = this.#Cone;
                    break;
                case FilterType.Bandpass:
                    if (i % 2 == 0)
                        zzeros[i] = this.#Cone;
                    else
                        zzeros[i] = this.#Cmone;
                    break;
                case FilterType.Notch:
                    if (i % 2 == 0)
                        zzeros[i] = new Complex(Math.cos(2 * Math.PI * ((cutoffHigh + cutoffLow) / 2) / samplingRate), Math.sin(2 * Math.PI * ((cutoffHigh + cutoffLow) / 2) / samplingRate));
                    else
                        zzeros[i] = new Complex(Math.cos(2 * Math.PI * ((cutoffHigh + cutoffLow) / 2) / samplingRate), -Math.sin(2 * Math.PI * ((cutoffHigh + cutoffLow) / 2) / samplingRate));
                    break;
                default:
                    throw new Error("Unknown filter type");
            }
        }

        //expand poly
        var topCoeffs  = new Array(numpoles + 1);
        var botCoeffs  = new Array(numpoles + 1);
        var a = new Array(numpoles + 1);
        var b = new Array(numpoles + 1);
        this.#expand(zzeros, topCoeffs, numpoles);
        this.#expand(zpoles, botCoeffs, numpoles);

        var FCgain = this.#Cone;
        if (type != FilterType.Notch) {
            var st = new Complex(0.0, Math.PI * (rawAlpha1 + rawAlpha2));
            var zfc = this.#cexp(st);
            FCgain = this.#evaluate(topCoeffs, botCoeffs, numpoles, zfc);
        }
        else
            FCgain = this.#evaluate(topCoeffs, botCoeffs, numpoles, this.#Cone);

        for (var i = 0; i <= numpoles; i++) {
            if (type == FilterType.Highpass || type == FilterType.Lowpass)
                b[i] = topCoeffs[i].Real / botCoeffs[numpoles].Real / FCgain.Magnitude / Math.sqrt(2);
            else
                b[i] = topCoeffs[i].Real / botCoeffs[numpoles].Real / FCgain.Magnitude;
            a[i] = botCoeffs[i].Real / botCoeffs[numpoles].Real;
        }

        this.Coefficients = new FilterCoefficients(a.reverse(), b.reverse());
    }

    #expand(pz, coeffs, numpoles) {
        coeffs[0] = this.#Cone;
        for (var i = 0; i < numpoles; i++)
            coeffs[i + 1] = this.#Czero;
        for (var i = 0; i < numpoles; i++)
            this.#multin(pz[i], coeffs, numpoles);

        for (var i = 0; i < numpoles + 1; i++) {
            if (Math.abs(coeffs[i].Imaginary) > 1e-10)
                throw new Error("Filter calculation failed. Coefficients of z^k not real.");
        }
    }

    #multin(w, coeffs, numpoles) {
        var nw = this.#cneg(w);
        for (var i = numpoles; i >= 1; i--)
            coeffs[i] = this.#cadd(this.#cmul(nw, coeffs[i]), coeffs[i - 1]);

        coeffs[0] = this.#cmul(nw, coeffs[0]);
    }

    #evaluate(topco, botco, np, z) {
        return this.#cdiv(this.#eval(topco, np, z), this.#eval(botco, np, z));
    }

    #eval(coeffs, np, z) {
        var sum = this.#Czero;
        for (var i = np; i >= 0; i--)
            sum = this.#cadd(this.#cmul(sum, z), coeffs[i]);
        return sum;
    }

    #xsqrt(x) {
        return (x >= 0.0) ? Math.sqrt(x) : 0.0;
    }

    #csqrt(x) {
        var r = Math.sqrt(Math.pow(x.Real, 2) + Math.pow(x.Imaginary, 2));
        var real = this.#xsqrt(0.5 * (r + x.Real));
        var imag = this.#xsqrt(0.5 * (r - x.Real));
        if (x.Imaginary < 0.0)
            imag = -imag;
        return new Complex(real, imag);
    }

    #cexp(x) {
        var r = Math.exp(x.Real);
        return new Complex(r * Math.cos(x.Imaginary), r * Math.sin(x.Imaginary));
    }

    #cadd(x, y) {
        return new Complex(x.Real + y.Real, x.Imaginary + y.Imaginary);
    }

    #csub(x, y) {
        return new Complex(x.Real - y.Real, x.Imaginary - y.Imaginary);
    }

    #cmul(x, y) {
        return new Complex((x.Real * y.Real - x.Imaginary * y.Imaginary), (x.Imaginary * y.Real + x.Real * y.Imaginary));
    }

    #cdiv(x, y) {
        var mag = y.Real * y.Real + y.Imaginary * y.Imaginary;
        return new Complex((x.Real * y.Real + x.Imaginary * y.Imaginary) / mag, (x.Imaginary * y.Real - x.Real * y.Imaginary) / mag);
    }

    #cneg(x) {
        return this.#csub(this.#Czero, x);
    }
}

export class Filter {
    /**
     * Applies a filter to the input data.
     * @param data 2D Array structured as [samples, channels].
     * @param filt A filter object @see Butterworth.
     * @returns Filtered data.
     */
    static filter(data, filt) {
        return this.#filt(data, filt, false, false);
    }

    /**
     * Applies a filter to the input data twice; forwards and backwards.
     * @param data 2D Array structured as [samples, channels].
     * @param filt A filter object @see Butterworth.
     * @returns Filtered data.
     */
    static filtfilt(data, filt) {
        return this.#filt(data, filt, true, false);
    }

    static #filt(data, filt, filtfilt, offsetCorrection) {
        var rows = data.length;
        var columns = data[0].length;
        var coeff = filt.Coefficients;

        //allocate buffers
        var dataOut = new Array(rows);
        for (var i = 0; i < rows; i++) {
            dataOut[i] = new Array(columns);
        }

        if (coeff.a.length != coeff.b.length)
            throw new Error("Invalid filter coefficients.");

        var numberOfCoefficients = coeff.a.length;
        var x = new Array(numberOfCoefficients);
        var y = new Array(numberOfCoefficients);
        for (var i = 0; i < numberOfCoefficients; i++) {
            x[i] = new Array(columns);
        }

        for (var i = 0; i < numberOfCoefficients; i++) {
            y[i] = new Array(columns);
        }

        var xyr = x.length;
        var xyc = x[0].length;
        for (var i = 0; i < xyr; i++) {
            for (var j = 0; j < xyc; j++) {
                if (offsetCorrection) {
                    x[i][j] = data[0][0];
                    y[i][j] = data[0][0];
                }
                else {
                    x[i][j] = 0;
                    y[i][j] = 0;
                }
            }
        }

        //filter
        for (var c = 0; c < columns; c++) {
            for (var r = 0; r < rows; r++) {
                //shift buffer
                for (var i = 0; i < numberOfCoefficients - 1; i++) {
                    x[i][c] = x[i + 1][c];
                    y[i][c] = y[i + 1][c];
                }

                //transfer function
                x[numberOfCoefficients - 1][c] = data[r][c];
                y[numberOfCoefficients - 1][c] = coeff.b[0] * x[numberOfCoefficients - 1][c];
                for (var i = 1; i < numberOfCoefficients; i++) {
                    y[numberOfCoefficients - 1][c] = y[numberOfCoefficients - 1][c] + coeff.b[i] * x[numberOfCoefficients - 1 - i][c] - coeff.a[i] * y[numberOfCoefficients - 1 - i][c];
                }
                dataOut[r][c] = y[numberOfCoefficients - 1][c];
            }
        }

        //filter reverse
        if (filtfilt) {
            for (var c = columns - 1; c >= 0; c--) {
                for (var r = rows - 1; r >= 0; r--) {
                    //shift buffer
                    for (var i = 0; i < numberOfCoefficients - 1; i++) {
                        x[i][c] = x[i + 1][c];
                        y[i][c] = y[i + 1][c];
                    }

                    //transfer function
                    x[numberOfCoefficients - 1][c] = dataOut[r][c];
                    y[numberOfCoefficients - 1][c] = coeff.b[0] * x[numberOfCoefficients - 1][c];
                    for (var i = 1; i < numberOfCoefficients; i++) {
                        y[numberOfCoefficients - 1][c] = y[numberOfCoefficients - 1][c] + coeff.b[i] * x[numberOfCoefficients - 1 - i][c] - coeff.a[i] * y[numberOfCoefficients - 1 - i][c];
                    }
                    dataOut[r][c] = y[numberOfCoefficients - 1][c];
                }
            }
        }

        return dataOut;
    }
}

export class RealtimeFilter {
    #coeff;
    #channels;
    #x;
    #y;

    constructor(filt, channels) {
        this.#coeff = filt.Coefficients;
        this.#channels = channels;

        if (this.#coeff.a.length != this.#coeff.b.length)
            throw new Error("Invalid filter coefficients.");

        var numberOfCoefficients = this.#coeff.a.length;
        this.#x = new Array(numberOfCoefficients);
        this.#y = new Array(numberOfCoefficients);
        for (var i = 0; i < numberOfCoefficients; i++) {
            this.#x[i] = new Array(this.#channels);
        }

        for (var i = 0; i < numberOfCoefficients; i++) {
            this.#y[i] = new Array(this.#channels);
        }

        var xyr = this.#x.length;
        var xyc = this.#x[0].length;
        for (var i = 0; i < xyr; i++) {
            for (var j = 0; j < xyc; j++) {
                this.#x[i][j] = 0;
                this.#y[i][j] = 0;
            }
        }
    }

    step(data) {
        var rows = data.length;
        var columns = data[0].length;
        var numberOfCoefficients = this.#coeff.a.length;

        if (columns != this.#channels)
            throw new Error('Invalid data dimensions.');

        var dataOut = new Array(rows);
        for (var i = 0; i < rows; i++) {
            dataOut[i] = new Array(columns);
        }

        for (var c = 0; c < columns; c++) {
            for (var r = 0; r < rows; r++) {
                //shift buffer
                for (var i = 0; i < numberOfCoefficients - 1; i++) {
                    this.#x[i][c] = this.#x[i + 1][c];
                    this.#y[i][c] = this.#y[i + 1][c];
                }

                //transfer function
                this.#x[numberOfCoefficients - 1][c] = data[r][c];
                this.#y[numberOfCoefficients - 1][c] = this.#coeff.b[0] * this.#x[numberOfCoefficients - 1][c];
                for (var i = 1; i < numberOfCoefficients; i++) {
                    this.#y[numberOfCoefficients - 1][c] = this.#y[numberOfCoefficients - 1][c] + this.#coeff.b[i] * this.#x[numberOfCoefficients - 1 - i][c] - this.#coeff.a[i] * this.#y[numberOfCoefficients - 1 - i][c];
                }
                dataOut[r][c] = this.#y[numberOfCoefficients - 1][c];
            }
        }

        return dataOut;
    }
}

class Complex {
    Real;
    Imaginary;
    Magnitude;

    constructor(real, imaginary) {
        this.Real = real;
        this.Imaginary = imaginary;
        this.Magnitude = Math.sqrt(Math.pow(this.Real, 2) + Math.pow(this.Imaginary, 2));
    }
}