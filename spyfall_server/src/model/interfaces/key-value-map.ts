/**
* Mapping of Key/Value Pairs. With optional typing.
*/
export interface KeyValueMap<T = string>{
	[key:string]: T
}
