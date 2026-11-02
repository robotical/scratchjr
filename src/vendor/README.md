# MP3 encoder

`lame-all.js` is vendored from the encoder used by MartyBlocks 4.0.80
(`MartyBlocks2.0/robotical/marty-blocks-lib/src/lame-all.js`). It retains its
upstream copyright and LGPL notices. The corresponding LGPL 2.1 text is included
in `editions/free/src/licenses/lamejs-LGPL-2.1.txt`. A license banner is added
for Webpack to retain the notice in the distributed bundle; the encoder
implementation is unchanged.

Blocks Jr uses this encoder for activity narration so the connected Marty's
streaming profile controls the MP3 sample rate, bitrate and ABR setting in both
standalone browsers and the React Native wrapper.
