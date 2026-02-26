import React, { lazy, Suspense } from 'react';
import { TiptapJSONInputProps } from '../types';

const TextEditorInput = lazy(() =>
    import('./TextEditorInput').then((m) => ({ default: m.default })),
);
const ContentEditorInput = lazy(() =>
    import('./ContentEditorInput').then((m) => ({ default: m.default })),
);

const TiptapEditorInput = React.forwardRef<{ focus: () => void }, TiptapJSONInputProps>((props, ref) => {
    const preset = (props.attribute?.options as any)?.preset ?? 'basic';
    const InputComponent = preset === 'basic' ? TextEditorInput : ContentEditorInput;

    return (
        <Suspense fallback={null}>
            <InputComponent {...props} ref={ref} />
        </Suspense>
    );
});

TiptapEditorInput.displayName = 'TiptapEditorInput';

export default TiptapEditorInput;
