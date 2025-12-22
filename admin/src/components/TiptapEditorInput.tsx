import React from 'react';
import ContentEditorInput from './ContentEditorInput';
import TextEditorInput from './TextEditorInput';
import { TiptapJSONInputProps } from '../types';

const TiptapEditorInput = React.forwardRef<{ focus: () => void }, TiptapJSONInputProps>((props, ref) => {
    const preset = (props.attribute?.options as any)?.preset || 'full';

    if (preset === 'basic') {
        return <TextEditorInput {...props} ref={ref} />;
    }

    return <ContentEditorInput {...props} ref={ref} />;
});

TiptapEditorInput.displayName = 'TiptapEditorInput';

export default TiptapEditorInput;
