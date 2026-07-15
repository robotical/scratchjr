import { describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/Localization', () => ({
    default: {
        localize: key => key
    }
}));

describe('Cog and Marty tutorial', () => {
    it('builds one direct Cog-triggered Marty script in Marty mode', async () => {
        const { default: tutorial } = await import('@/tutorial/tutorials-data/cog-and-marty.js');
        const steps = tutorial.tutorialSteps;
        const actions = steps.flatMap(step => [
            ...(step.instructionActions || []),
            ...(step.nextStepActions || []),
            ...(step.hintActions || [])
        ]);

        expect(steps).toHaveLength(8);
        const cogCategoryStep = steps.find(step =>
            step.instructionActions.some(action => action.text === 'COG_AND_MARTY_TUTORIAL_COG_BLOCKS'));
        expect(cogCategoryStep.nextStepActions[0]).toEqual({ type: 'ShowMartyMode' });
        expect(actions.filter(action => action.type === 'HighlightElement').map(action => action.elementId))
            .not.toContain('martyMode');

        expect(actions.filter(action => action.type === 'ShowCategory').map(action => action.category))
            .not.toContain('sprite-start');
        expect(actions.flatMap(action => action.blocks || (action.block ? [action.block] : [])))
            .not.toEqual(expect.arrayContaining(['message_block', 'onmessage_block']));
        expect(actions.filter(action => action.type === 'ShowInstructorText').map(action => action.text))
            .not.toEqual(expect.arrayContaining([
                'COG_AND_MARTY_TUTORIAL_SPRITE_BLOCKS',
                'COG_AND_MARTY_TUTORIAL_MESSAGE_BLOCK',
                'COG_AND_MARTY_TUTORIAL_ONMESSAGE_BLOCK'
            ]));

        expect(steps.flatMap(step => step.expectedCode || [])).toEqual([
            'ontouchcog',
            'ontouchcog=>martyDance'
        ]);
    });
});
