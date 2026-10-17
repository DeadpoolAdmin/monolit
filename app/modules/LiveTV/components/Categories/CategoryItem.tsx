import React from 'react'
import ICategories from '../../types/categories.interface'

const CategoryItem = ({ style, item, isActive }: {
    style: React.CSSProperties,
    item: ICategories,
    isActive: boolean,
}) => {
    return (
        <div style={style} className={`categories__item ${isActive ? 'active' : ''}`}>
            <div className='categories__item_name'>
                <span>{item.name}</span>
            </div>
        </div>
    )
}

export default CategoryItem