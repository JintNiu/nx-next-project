import * as React from 'react';
import ViewerCore from './ViewerCore';
import ViewerProps from './ViewerProps';

export default (props: ViewerProps) => {
    return (
        <ViewerCore
            {...props}
        />
    );
};
