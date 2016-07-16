import {OpaqueToken} from '@angular/core';

export let APP_CONFIG = new OpaqueToken('app.config');

export interface Config {
	title: string,
	apiGetData: string,
	apiGetStat: string,
	apiSignup: string,
	apiLogin: string,
	apiContact: string,
	apiGetBalance: string
}

export const CONFIG:Config = {
	title: 'AION Kristall',
	apiGetData: 'http://host3/data/status',
	apiGetStat: 'http://host3/data/stat',
	apiSignup: 'http://host3/auth/signup',
	apiLogin: 'http://host3/auth/login',
  	apiContact: 'http://host3/auth/contact',
  	apiGetBalance : 'http://host3/data/balanse'
};
