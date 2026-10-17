export const makePlayableLink = (url: string, username: string, password: string, stream_id: string | number) => {
    const baseUrl = url.split('/').slice(0, 3).join('/');

    return `${baseUrl}/${username}/${password}/${stream_id}`;
}