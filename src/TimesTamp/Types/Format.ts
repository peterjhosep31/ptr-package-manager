type CharactersAllowed = 'Y' | 'm' | 'd' | 'H' | 'i' | 's' | '-' | '/' | ':' | ' ';


type OnlyAllowedCharacters<T extends string> =
    T extends `${infer First}${infer Rest}`
    ? First extends CharactersAllowed
    ? OnlyAllowedCharacters<Rest>
    : never
    : T;


type Format = OnlyAllowedCharacters<string>;


export type { Format, CharactersAllowed, OnlyAllowedCharacters };
