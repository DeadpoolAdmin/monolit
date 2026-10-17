import Genres from "./genres.interface"

export type PCategoriesAll = {
    all : Genres[]
}

export type PCategoriesItem = {
    isActive : boolean
    style : React.CSSProperties
    item : any
    index? : number,
    all?: Genres[]
}