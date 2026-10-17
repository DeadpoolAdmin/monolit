import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    ReactNode,
} from 'react';


type PApp<T> = {
    data: T[];
    type: string;
    listType: string;
    width: number;
    height?: number;
    itemIndex?: number;
    style?: React.CSSProperties;
    dimension: string;
    onClick?: () => void;
    renderItem: ({
        style,
        item,
        isActive,
        key,
    }: {
        style: React.CSSProperties;
        item: T;
        isActive: boolean;
        key: React.Key;
        itemIndex?: number
    }) => ReactNode;
};


import '@shared/styles/ScrollView/scroll_view.scss'


const ScrollView = <T extends unknown>({
    data,
    listType,
    width,
    renderItem,
    height,
    onClick,
    style = {},
    itemIndex = 0,
    dimension
}: PApp<T>) => {
    const [visibleData, setVisibleData] = useState<T[]>(data.slice(0, 20));
    const lastItemRef = useRef<HTMLDivElement | null>(null);
    const [index, setIndex] = useState(20);

    const dim = dimension ? dimension : 'rem';

    // Reset when data changes
    useEffect(() => {
        setVisibleData(data.slice(0, 20));
        setIndex(20);
    }, [data]);

    const loadMoreItems = useCallback(() => {
        if (index >= data.length) return;

        const nextBatch = data.slice(index, index + 20);
        setVisibleData((prev) => [...prev, ...nextBatch]);
        setIndex((prev) => prev + 20);
    }, [index, data]);

    useEffect(() => {
        if (!lastItemRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreItems();
                }
            },
            { rootMargin: '100px' }
        );

        observer.observe(lastItemRef.current);
        return () => observer.disconnect();
    }, [loadMoreItems]);

    const defaultStyles: React.CSSProperties = {
        width: width ? width + 'rem' : 'auto',
        height: height ? height + dim : 'auto',
        overflowX: listType === 'horizontal-list' ? 'auto' : 'hidden',
        scrollbarWidth: 'none'
    }

    const renderList = (items: T[]) =>
        items.map((item, i) => {
            const isActive = false;
            const style = {};
            const key = i;

            const element = renderItem({
                style,
                item,
                isActive,
                key,
                itemIndex
            });

            // Attach the observer to the last item
            if (i === items.length - 1) {
                return (
                    <div ref={lastItemRef} key={key}>
                        {element}
                    </div>
                );
            }

            return <div key={key}>{element}</div>;
        });

    return (
        <div onClick={onClick} className={`data__drawer ${listType}`}
            style={{
                ...defaultStyles,
                ...style
            }}
        >
            {renderList(data.length < 10 ? data : visibleData)}
        </div>
    );
};
export default ScrollView;
