import { ILexingResult, IToken } from "chevrotain";

export declare function tokenize(text: string): ILexingResult;
export declare const tokensDictionary: { [tokenName: string]: IToken };
