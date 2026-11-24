import Localization from '../../utils/Localization';
// Shared visual order for Cog's icon arguments and Marty's RGB arguments.
export const COLOUR_SWATCHES = [
    {name: 'red', colour: '#e51f26'},
    {name: 'orange', colour: '#d58c22'},
    {name: 'yellow', colour: '#e9ed08'},
    {name: 'green', colour: '#099b43'},
    {name: 'blue', colour: '#386ab2'},
    {name: 'purple', colour: '#7e2785'}
];

export const SENSED_COLOUR_SWATCHES = COLOUR_SWATCHES.filter(swatch => swatch.name !== 'orange')
    .concat([{name: 'none', colour: '#ffffff'}]);

export function swatchLabel (swatch) {
    return Localization.localize('COLOUR_SWATCH_' + swatch.name.toUpperCase());
}

export function addColourPaletteHeader (parent, device) {
    var icon = document.createElement('img');
    icon.className = 'colour-palette-icon ' + device;
    var artwork = device === 'cog' ? 'CogColourPalette' :
        (device === 'marty-sensor' ? 'martycoloursensednone' : 'MartyColourPalette');
    icon.src = 'assets/blockicons/' + artwork + '.svg';
    icon.alt = '';
    parent.appendChild(icon);
    var label = document.createElement('div');
    label.className = 'colour-palette-label';
    label.textContent = Localization.localize('COLOUR_PALETTE_PROMPT');
    parent.appendChild(label);
    var grid = document.createElement('div');
    grid.className = 'colour-palette-grid';
    parent.appendChild(grid);
    return grid;
}
