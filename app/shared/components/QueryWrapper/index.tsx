import React, { ReactNode } from 'react';
import Loading from '@/shared/components/Loading/Loader';
import Empty from '@/shared/components/Empty';

interface QueryWrapperProps {
    isLoading: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    error?: any;
    children: ReactNode;
    loadingComponent?: ReactNode;
    emptyComponent?: ReactNode;
    errorComponent?: ReactNode;
}

const QueryWrapper: React.FC<QueryWrapperProps> = ({
    isLoading,
    isError = false,
    isEmpty = false,
    error,
    children,
    loadingComponent,
    emptyComponent,
    errorComponent,
}) => {
    if (isLoading) {
        return <>{loadingComponent || <Loading />}</>;
    }

    if (isError) {
        if (errorComponent) {
            return <>{errorComponent}</>;
        }
        console.error('Query error:', error);
        return <Empty />;
    }

    if (isEmpty) {
        return <>{emptyComponent || <Empty />}</>;
    }

    return <>{children}</>;
};

export default QueryWrapper;

