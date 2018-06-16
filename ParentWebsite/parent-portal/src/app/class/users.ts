export class Users {

    private Username:string; 
    private Password:string; 
    private Name:string; 


    
    constructor() {

    }

    /**
     * Getter $Username
     * @return {string}
     */
	public get $Username(): string {
		return this.Username;
	}

    /**
     * Setter $Username
     * @param {string} value
     */
	public set $Username(value: string) {
		this.Username = value;
	}
    


    /**
     * Getter $Password
     * @return {string}
     */
	public get $Password(): string {
		return this.Password;
	}

    /**
     * Setter $Password
     * @param {string} value
     */
	public set $Password(value: string) {
		this.Password = value;
	}
    

    /**
     * Getter $Name
     * @return {string}
     */
	public get $Name(): string {
		return this.Name;
	}

    /**
     * Setter $Name
     * @param {string} value
     */
	public set $Name(value: string) {
		this.Name = value;
	}
    
}
