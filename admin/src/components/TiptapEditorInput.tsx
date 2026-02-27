import React from 'react';
import { TiptapJSONInputProps } from '../types';
import TextEditorInput from './TextEditorInput';
import ContentEditorInput from './ContentEditorInput';

const TiptapEditorInput = React.forwardRef<{ focus: () => void }, TiptapJSONInputProps>((props, ref) => {
    const preset = (props.attribute?.options as any)?.preset ?? 'basic';
    const InputComponent = preset === 'basic' ? TextEditorInput : ContentEditorInput;

    return <InputComponent {...props} ref={ref} />;
});

TiptapEditorInput.displayName = 'TiptapEditorInput';

export default TiptapEditorInput;
