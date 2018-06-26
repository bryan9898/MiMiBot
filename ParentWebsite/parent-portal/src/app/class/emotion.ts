import { Speeches } from "src/app/class/speeches";

export class Emotion {
    private biasEmotion : Array<Map<string,string>>;
    private neutralEmotion: Array<Map<string,string>>;
    private dataSet: Speeches; 
    private status: string; 

    constructor(biasEmotion, neutralEmotion, dataSet) {
        this.biasEmotion = biasEmotion; 
        this.neutralEmotion = neutralEmotion; 
        this.dataSet = dataSet ; 
        this.status = this.processStatus(biasEmotion, neutralEmotion);
       
    }
    
    private processStatus(biasEmotion, neutralEmotion)
    {
        if(biasEmotion.length != 0)
        {
            return "bias";
        }
        else {
            return "neutral";
        }
    }
    

    /**
     * Getter $biasEmotion
     * @return {Array<Map<string,string>>}
     */
	public get $biasEmotion(): Array<Map<string,string>> {
		return this.biasEmotion;
	}

    /**
     * Setter $biasEmotion
     * @param {Array<Map<string,string>>} value
     */
	public set $biasEmotion(value: Array<Map<string,string>>) {
		this.biasEmotion = value;
	}
    

    /**
     * Getter $neutralEmotion
     * @return {Array<Map<string,string>>}
     */
	public get $neutralEmotion(): Array<Map<string,string>> {
		return this.neutralEmotion;
	}

    /**
     * Setter $neutralEmotion
     * @param {Array<Map<string,string>>} value
     */
	public set $neutralEmotion(value: Array<Map<string,string>>) {
		this.neutralEmotion = value;
	}

    /**
     * Getter $dataSet
     * @return {Speeches}
     */
	public get $dataSet(): Speeches {
		return this.dataSet;
	}

    /**
     * Setter $dataSet
     * @param {Speeches} value
     */
	public set $dataSet(value: Speeches) {
		this.dataSet = value;
	}

    /**
     * Getter $status
     * @return {string}
     */
	public get $status(): string {
		return this.status;
	}

    /**
     * Setter $status
     * @param {string} value
     */
	public set $status(value: string) {
		this.status = value;
	}
    
    
}
