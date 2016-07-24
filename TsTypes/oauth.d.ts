declare module "oauth" {
	var OAuthExport: OAuthModule;
    export = OAuthExport;

}

interface OAuthModule {
	OAuth2: OAuth.OAuth2;
	Something: string;
}

declare namespace OAuth {
	interface OAuth2 {
		new (appId: string|number, secret: string, baseUrl: string, authorisePath: string, tokenPath: string, something: any): OAuth2;
		getAuthorizeUrl(options: any): string;
		getOAuthAccessToken(code: string, options: AccessTokenOptions, 
			callback: (e:any, access_token: string, refresh_token: string, results: any) => void): void;
	}

	interface AccessTokenOptions {
		grant_type?:string;
		redirect_uri?: string;
	}
}
// interface SrcdsRcon {

// 	(options:SrcdsRcon.ServerInfo): SrcdsRcon.SrcdsRconConnection;

	
// }

// declare namespace OAuth {
// interface SrcdsRconConnection {
// 	connect(): Promise<void>;
// 		command(command: string): Promise<string>;
// 		disconnect(): Promise<any>;
// }

// interface OAuth {
// 		address: string;
// 		password?: string; // not actually optional, just making it compatibale with types elsewhere
// 	}

// }