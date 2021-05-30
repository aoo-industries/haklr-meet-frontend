
export interface User {
    nickname: string;
    roomId: string;
    id?: string;
    streamId?: string;
    peerId?: string;
    loggedIn?: boolean;
    screenshareActive: boolean;
}

