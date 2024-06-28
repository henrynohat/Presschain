import {
    Actor,
    HttpAgent,
    Principal,
    ActorConfig,
    createActor,
    ActorSubclass,
    HttpAgentOptions,
    IDL,
} from '@dfinity/agent';

// Define types for news and user interaction

type Article = {
    id: string;
    title: string;
    content: string;
    topic: string;
    journalistId: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    requestedTopics: string[];
};

type Journalist = {
    id: string;
    name: string;
    email: string;
    articles: Article[];
};

// Define actor interface

const newsAppIDL = IDL.Service({
    getUser: IDL.Func([], [IDL.Opt(User)], ['query']),
    getAllUsers: IDL.Func([], [IDL.Vec(User)], ['query']),
    createUser: IDL.Func([IDL.Text, IDL.Text], [], []),
    requestTopic: IDL.Func([IDL.Text, IDL.Text], [], []),
    getAllJournalists: IDL.Func([], [IDL.Vec(Journalist)], ['query']),
    getJournalistById: IDL.Func([IDL.Text], [IDL.Opt(Journalist)], ['query']),
    createJournalist: IDL.Func([IDL.Text, IDL.Text], [], []),
    uploadArticle: IDL.Func([IDL.Text, IDL.Text, IDL.Text, IDL.Text], [], []),
});

// Create actor class

class NewsApp extends Actor implements newsAppIDL {
    constructor(agent: HttpAgent, canisterId: Principal, options?: ActorConfig) {
        super(newsAppIDL, canisterId, agent, options);
    }

    async getUser(): Promise<User | null> {
        return await this.call('getUser');
    }

    async getAllUsers(): Promise<User[]> {
        return await this.call('getAllUsers');
    }

    async createUser(name: string, email: string): Promise<void> {
        await this.call('createUser', name, email);
    }

    async requestTopic(userId: string, topic: string): Promise<void> {
        await this.call('requestTopic', userId, topic);
    }

    async getAllJournalists(): Promise<Journalist[]> {
        return await this.call('getAllJournalists');
    }

    async getJournalistById(journalistId: string): Promise<Journalist | null> {
        return await this.call('getJournalistById', journalistId);
    }

    async createJournalist(name: string, email: string): Promise<void> {
        await this.call('createJournalist', name, email);
    }

    async uploadArticle(journalistId: string, title: string, content: string, topic: string): Promise<void> {
        await this.call('uploadArticle', journalistId, title, content, topic);
    }
}

// Create actor factory function

const createNewsAppActor = (agent: HttpAgent) => {
    const canisterId = Principal.fromText('bkyz2-fmaaa-aaaaa-qaaaq-cai'); // Replace with your actual canister ID
    return Actor.createActor<NewsApp>(newsAppIDL, {
        agent,
        canisterId,
    });
};

export { NewsApp, createNewsAppActor };


// dfinity_js_backend: bkyz2-fmaaa-aaaaa-qaaaq-cai
// dfinity_js_frontend: bd3sg-teaaa-aaaaa-qaaba-cai
// internet_identity: be2us-64aaa-aaaaa-qaabq-cai
// ledger_canister: br5f7-7uaaa-aaaaa-qaaca-cai