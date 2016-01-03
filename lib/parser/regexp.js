'use babel';

import XRegExp from "xregexp";

export const splitRegex = /([\+\-*\/^\(\)]|=>?|\s)/;

export const lettersOnly = new XRegExp("^\\p{L}+$", "i");

export const validIdentifier = new XRegExp("^(\\p{L}\\p{L}?|\\p{L}[ \\p{L}]*[^ ])$", "i");
