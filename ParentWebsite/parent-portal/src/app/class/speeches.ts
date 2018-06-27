export class Speeches {

    private speechId : string;
    private speechDetails : string;
    private userId : string ;
    private topics : Array<string>;
    private sentiment: Map<string, string>;
    private keywords: Map<string, string>;


	constructor(speechId, speechDetails, userId, topics, sentiment , keywords) {
        this.speechId = speechId; 
        this.speechDetails = speechDetails; 
        this.userId = userId ; 
        this.topics = topics;
        this.sentiment = sentiment;
        this.keywords = keywords; 
	}
    

    /**
     * Getter $speechId
     * @return {string}
     */
	public get $speechId(): string {
		return this.speechId;
	}

    /**
     * Setter $speechId
     * @param {string} value
     */
	public set $speechId(value: string) {
		this.speechId = value;
	}

    /**
     * Getter $speechDetails
     * @return {string}
     */
	public get $speechDetails(): string {
		return this.speechDetails;
	}

    /**
     * Setter $speechDetails
     * @param {string} value
     */
	public set $speechDetails(value: string) {
		this.speechDetails = value;
	}

    /**
     * Getter $userId
     * @return {string }
     */
	public get $userId(): string  {
		return this.userId;
	}

    /**
     * Setter $userId
     * @param {string } value
     */
	public set $userId(value: string ) {
		this.userId = value;
	}

    /**
     * Getter $topics
     * @return {Array<string>}
     */
	public get $topics(): Array<string> {
		return this.topics;
	}

    /**
     * Setter $topics
     * @param {Array<string>} value
     */
	public set $topics(value: Array<string>) {
		this.topics = value;
    }
    

    /**
     * Getter $sentiment
     * @return {Map<string, string>}
     */
	public get $sentiment(): Map<string, string> {
		return this.sentiment;
	}

    /**
     * Setter $sentiment
     * @param {Map<string, string>} value
     */
	public set $sentiment(value: Map<string, string>) {
		this.sentiment = value;
    }
    

    /**
     * Getter $keywords
     * @return {Map<string, string>}
     */
	public get $keywords(): Map<string, string> {
		return this.keywords;
	}

    /**
     * Setter $keywords
     * @param {Map<string, string>} value
     */
	public set $keywords(value: Map<string, string>) {
		this.keywords = value;
	}
    
    
}
