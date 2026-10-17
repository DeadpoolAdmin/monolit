import React, { useEffect, useState } from "react";
import "@shared/styles/ScrollGridView/scroll_grid_view.scss";

interface ScrollGridViewProps {
  style?: React.CSSProperties;
  data: { [key: string]: { header: React.ReactNode; items: string[] } };
  renderItem: (item: string) => React.ReactNode;
  itemWidth?: number;
  itemHeight?: number;
  gap?: number;
}

const ScrollGridView: React.FC<ScrollGridViewProps> = ({ 
  style, 
  data, 
  renderItem,
  itemWidth = 17,
  itemHeight = 6,
  gap = 2
}) => {
  // data structure example:
  /*
    {
    "2025-11-06": {
      header: <><IoCalendarOutline /><span>Nov 6, 2025</span></>,
      items: [
        "12:00 AM",
        "3:00 AM",
        "6:00 AM",
        ...
      ]
    },
    "2024-12-06": {
      header: <><IoCalendarOutline /><span>Dec 6, 2024</span></>,
      items: [
        "12:00 AM",
        "3:10 AM",
        ...
      ]
    }
  }
  */

  const [visibleData, setVisibleData] = useState<{ [key: string]: { header: React.ReactNode; items: string[] } }>(data);

  useEffect(() => {
    setVisibleData(data);
  }, [data]);

  return (
    <div className="scroll_grid_view__wrapper" style={style}>
      <div className="scroll_grid_view__content">
        {Object.entries(visibleData).map(([key, { header, items }]) => (
          <div key={key} className="scroll_grid_view__row">
            <div className="scroll_grid_view__header">
              {header}
            </div>
            <div className="scroll_grid_view__items">
              {items.map((item, index) => (
                <div 
                  key={`${key}-${index}`} 
                  className="scroll_grid_view__item"
                  style={{
                    width: `${itemWidth}rem`,
                    height: `${itemHeight}rem`,
                    marginRight: `${gap}rem`
                  }}
                >
                  {renderItem(item)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ScrollGridView);
