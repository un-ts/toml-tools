import { CstNode, ICstVisitor, IToken } from "chevrotain";

export function parse(text: string, startProduction?: string): CstNode;
export const BaseTomlCstVisitor: TomlCstVisitorConstructor<any, any>;

// TODO: The following signatures need to be generated
//       auto-magically.
export abstract class TomlCstVisitor<IN, OUT> implements ICstVisitor<IN, OUT> {
  // No need to implement these two methods
  // Generic Visit method implemented by the Chevrotain Library
  visit(cstNode: CstNode | CstNode[], param?: IN): OUT;
  validateVisitor(): void;

  abstract visitToml(ctx: TomlCtx, param?: IN): OUT;
  abstract visitExpression(ctx: ExpressionCtx, param?: IN): OUT;
  abstract visitKeyval(ctx: KeyvalCtx, param?: IN): OUT;
  abstract visitKey(ctx: KeyCtx, param?: IN): OUT;
  abstract visitVal(ctx: ValCtx, param?: IN): OUT;
  abstract visitArray(ctx: ArrayCtx, param?: IN): OUT;
  abstract visitArrayValues(ctx: ArrayValuesCtx, param?: IN): OUT;
  abstract visitInlineTable(ctx: InlineTableCtx, param?: IN): OUT;
  abstract visitInlineTableKeyVals(ctx: InlineTableKeyValsCtx, param?: IN): OUT;
  abstract visitTable(ctx: TableCtx, param?: IN): OUT;
  abstract visitStdTable(ctx: StdTableCtx, param?: IN): OUT;
  abstract visitArrayTable(ctx: ArrayTableCtx, param?: IN): OUT;
  abstract visitNl(ctx: NlCtx, param?: IN): OUT;
  abstract visitCommentNewline(ctx: CommentNewlineCtx, param?: IN): OUT;
}

interface TomlCstVisitorConstructor<IN, OUT> {
  new (): TomlCstVisitor<IN, OUT>;
}

export interface TomlCstNode extends CstNode {
  name: "toml";
  children: TomlCtx;
}
export type TomlCtx = {
  expression: ExpressionCstNode[];
  nl: NlCstNode[];
};

export interface ExpressionCstNode extends CstNode {
  name: "expression";
  children: ExpressionCtx;
}
export type ExpressionCtx = {
  keyval: KeyvalCstNode[];
  table: TableCstNode[];
  Comment: IToken[];
};

export interface KeyvalCstNode extends CstNode {
  name: "keyval";
  children: KeyvalCtx;
}
export type KeyvalCtx = {
  key: KeyCstNode[];
  KeyValSep: IToken[];
  val: ValCstNode[];
};

export interface KeyCstNode extends CstNode {
  name: "key";
  children: KeyCtx;
}

export type KeyCtx = {
  IKey: IToken[];
  Dot: IToken[];
};

export interface ValCstNode extends CstNode {
  name: "val";
  children: ValCtx;
}

export type ValCtx = {
  IString: IToken[];
  IBoolean: IToken[];
  array: ArrayCstNode[];
  inlineTable: InlineTableCstNode[];
  IDateTime: IToken[];
  IFloat: IToken[];
  IInteger: IToken[];
};

export interface ArrayCstNode extends CstNode {
  name: "array";
  children: ArrayCtx;
}
export type ArrayCtx = {
  LSquare: IToken[];
  commentNewline: CommentNewlineCstNode[];
  arrayValues: ArrayValuesCstNode[];
  RSquare: IToken[];
};

export interface ArrayValuesCstNode extends CstNode {
  name: "arrayValues";
  children: ArrayValuesCtx;
}
export type ArrayValuesCtx = {
  commentNewline: CommentNewlineCstNode[];
  val: ValCstNode[];
  Comma: IToken[];
};

export interface InlineTableCstNode extends CstNode {
  name: "inlineTable";
  children: InlineTableCtx;
}
export type InlineTableCtx = {
  LCurly: IToken[];
  inlineTableKeyVals: InlineTableKeyValsCstNode[];
  RCurly: IToken[];
};

export interface InlineTableKeyValsCstNode extends CstNode {
  name: "inlineTableKeyVals";
  children: InlineTableKeyValsCtx;
}
export type InlineTableKeyValsCtx = {
  keyval: KeyvalCstNode[];
  Comma: IToken[];
};

export interface TableCstNode extends CstNode {
  name: "table";
  children: TableCtx;
}
export type TableCtx = {
  stdTable?: StdTableCstNode[];
  arrayTable?: ArrayTableCstNode[];
};

export interface StdTableCstNode extends CstNode {
  name: "stdTable";
  children: StdTableCtx;
}
export type StdTableCtx = {
  LSquare: IToken[];
  key: KeyCstNode[];
  RSquare: IToken[];
};

export interface ArrayTableCstNode extends CstNode {
  name: "arrayTable";
  children: ArrayTableCtx;
}
export type ArrayTableCtx = {
  LSquare: IToken[];
  key: KeyCstNode[];
  RSquare: IToken[];
};

export interface NlCstNode extends CstNode {
  name: "nl";
  children: NlCtx;
}
export type NlCtx = {
  Newline: IToken[];
};

export interface CommentNewlineCstNode extends CstNode {
  name: "commentNewline";
  children: CommentNewlineCtx;
}
export type CommentNewlineCtx = {
  Comment?: IToken[];
  Newline?: IToken[];
};
