export const random = (): string => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 12; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
};

export const isEmail = (email: string): boolean => 
	(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email);

export const sanitizeText = (text: string): boolean =>
  	/^[A-Za-z]+(?:\s[A-Za-z'-]+)*$/.test(text);