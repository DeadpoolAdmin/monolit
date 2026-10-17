import React from "react";
import "./Skeleton.scss";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "2rem",
  borderRadius = "0.5rem",
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style,
      }}
    />
  );
};

interface SkeletonTableProps {
  rows?: number;
  columns?: {
    width?: string;
    height?: string;
  }[];
  showHeader?: boolean;
  headers?: string[];
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 3,
  columns = [],
  showHeader = true,
  headers = [],
}) => {
  return (
    <div className="skeleton-table">
      <table>
        {showHeader && (
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="skeleton-row">
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  <Skeleton
                    width={column.width || "100%"}
                    height={column.height || "2.5rem"}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface SkeletonListProps {
  count?: number;
  itemHeight?: string | number;
  itemWidth?: string | number;
  gap?: string | number;
  direction?: "horizontal" | "vertical";
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  itemHeight = "6rem",
  itemWidth = "17rem",
  gap = "2rem",
  direction = "horizontal",
}) => {
  return (
    <div
      className="skeleton-list"
      style={{
        display: "flex",
        flexDirection: direction === "horizontal" ? "row" : "column",
        gap,
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton key={index} width={itemWidth} height={itemHeight} />
      ))}
    </div>
  );
};

interface SkeletonCardProps {
  showImage?: boolean;
  imageHeight?: string | number;
  showTitle?: boolean;
  titleWidth?: string | number;
  showDescription?: boolean;
  descriptionLines?: number;
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showImage = true,
  imageHeight = "10rem",
  showTitle = true,
  titleWidth = "80%",
  showDescription = true,
  descriptionLines = 2,
  className = "",
}) => {
  return (
    <div className={`skeleton-card ${className}`}>
      {showImage && <Skeleton height={imageHeight} className="skeleton-image" />}
      {showTitle && (
        <Skeleton
          width={titleWidth}
          height="2.5rem"
          className="skeleton-title"
          style={{ marginTop: "1rem" }}
        />
      )}
      {showDescription &&
        Array.from({ length: descriptionLines }).map((_, index) => (
          <Skeleton
            key={index}
            width={index === descriptionLines - 1 ? "60%" : "100%"}
            height="2rem"
            style={{ marginTop: "0.5rem" }}
          />
        ))}
    </div>
  );
};

