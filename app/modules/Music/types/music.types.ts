export type PMusicItem = {
    _id: number;
    title: string;
    image: string;
    authorName: string;
    url: string;
    file: string;
    type?: 'radio' | 'music';
}

