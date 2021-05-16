import { css } from '@linaria/core'

export const preview = css`
  h1 > a:nth-child(1),
  h2 > a:nth-child(1),
  h3 > a:nth-child(1),
  h4 > a:nth-child(1),
  h5 > a:nth-child(1),
  h6 > a:nth-child(1) {
    float: left;
    line-height: 1;
    margin-left: -20px;
    padding-right: 4px;
  }

  h1 > a:nth-child(1):focus,
  h2 > a:nth-child(1):focus,
  h3 > a:nth-child(1):focus,
  h4 > a:nth-child(1):focus,
  h5 > a:nth-child(1):focus,
  h6 > a:nth-child(1):focus {
    outline: none;
  }

  h1 > a:nth-child(1) > span,
  h2 > a:nth-child(1) > span,
  h3 > a:nth-child(1) > span,
  h4 > a:nth-child(1) > span,
  h5 > a:nth-child(1) > span,
  h6 > a:nth-child(1) > span {
    color: #1b1f23;
    vertical-align: middle;
    visibility: hidden;
    display: inline-block;
    fill: currentColor;
    vertical-align: text-bottom;
  }

  h1:hover > a:nth-child(1),
  h2:hover > a:nth-child(1),
  h3:hover > a:nth-child(1),
  h4:hover > a:nth-child(1),
  h5:hover > a:nth-child(1),
  h6:hover > a:nth-child(1) {
    text-decoration: none;
  }

  h1:hover > a:nth-child(1) > span,
  h2:hover > a:nth-child(1) > span,
  h3:hover > a:nth-child(1) > span,
  h4:hover > a:nth-child(1) > span,
  h5:hover > a:nth-child(1) > span,
  h6:hover > a:nth-child(1) > span {
    visibility: visible;
  }

  h1:hover > a:nth-child(1) > span:before,
  h2:hover > a:nth-child(1) > span:before,
  h3:hover > a:nth-child(1) > span:before,
  h4:hover > a:nth-child(1) > span:before,
  h5:hover > a:nth-child(1) > span:before,
  h6:hover > a:nth-child(1) > span:before {
    width: 16px;
    height: 16px;
    content: ' ';
    display: inline-block;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' width='16' height='16' aria-hidden='true'%3E%3Cpath fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'%3E%3C/path%3E%3C/svg%3E");
  }

  & {
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    line-height: 1.5;
    color: #24292e;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial,
      sans-serif, Apple Color Emoji, Segoe UI Emoji;
    font-size: 16px;
    line-height: 1.5;
    word-wrap: break-word;
    padding: 0 20px;
  }

  details {
    display: block;
  }

  summary {
    display: list-item;
  }

  a {
    background-color: initial;
  }

  a:active,
  a:hover {
    outline-width: 0;
  }

  strong {
    font-weight: inherit;
    font-weight: bolder;
  }

  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  img {
    border-style: none;
  }

  code,
  kbd,
  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }

  hr {
    box-sizing: initial;
    height: 0;
    overflow: visible;
  }

  input {
    font: inherit;
    margin: 0;
  }

  input {
    overflow: visible;
  }

  [type='checkbox'] {
    box-sizing: border-box;
    padding: 0;
  }

  * {
    box-sizing: border-box;
  }

  input {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
  }

  a {
    color: #0366d6;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  strong {
    font-weight: 600;
  }

  hr {
    height: 0;
    margin: 15px 0;
    overflow: hidden;
    background: transparent;
    border: 0;
    border-bottom: 1px solid #dfe2e5;
  }

  hr:after,
  hr:before {
    display: table;
    content: '';
  }

  hr:after {
    clear: both;
  }

  table {
    border-spacing: 0;
    border-collapse: collapse;
  }

  td,
  th {
    padding: 0;
  }

  details summary {
    cursor: pointer;
  }

  kbd {
    display: inline-block;
    padding: 3px 5px;
    font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    line-height: 10px;
    color: #444d56;
    vertical-align: middle;
    background-color: #fafbfc;
    border: 1px solid #d1d5da;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #d1d5da;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 0;
  }

  h1 {
    font-size: 32px;
  }

  h1,
  h2 {
    font-weight: 600;
  }

  h2 {
    font-size: 24px;
  }

  h3 {
    font-size: 20px;
  }

  h3,
  h4 {
    font-weight: 600;
  }

  h4 {
    font-size: 16px;
  }

  h5 {
    font-size: 14px;
  }

  h5,
  h6 {
    font-weight: 600;
  }

  h6 {
    font-size: 12px;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
  }

  blockquote {
    margin: 0;
  }

  ol,
  ul {
    padding-left: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  ol ol,
  ul ol {
    list-style-type: lower-roman;
  }

  ol ol ol,
  ol ul ol,
  ul ol ol,
  ul ul ol {
    list-style-type: lower-alpha;
  }

  dd {
    margin-left: 0;
  }

  code,
  pre {
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    font-size: 12px;
  }

  pre {
    margin-top: 0;
    margin-bottom: 0;
  }

  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button {
    margin: 0;
    -webkit-appearance: none;
    appearance: none;
  }

  hr {
    border-bottom-color: #eee;
  }

  kbd {
    display: inline-block;
    padding: 3px 5px;
    font: 11px SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    line-height: 10px;
    color: #444d56;
    vertical-align: middle;
    background-color: #fafbfc;
    border: 1px solid #d1d5da;
    border-radius: 3px;
    box-shadow: inset 0 -1px 0 #d1d5da;
  }

  a:not([href]) {
    color: inherit;
    text-decoration: none;
  }

  blockquote,
  details,
  dl,
  ol,
  p,
  pre,
  table,
  ul {
    margin-top: 0;
    margin-bottom: 16px;
  }

  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: #e1e4e8;
    border: 0;
  }

  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }

  blockquote > :first-child {
    margin-top: 0;
  }

  blockquote > :last-child {
    margin-bottom: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  h1 {
    font-size: 2em;
  }

  h1,
  h2 {
    padding-bottom: 0.3em;
    border-bottom: 1px solid #eaecef;
  }

  h2 {
    font-size: 1.5em;
  }

  h3 {
    font-size: 1.25em;
  }

  h4 {
    font-size: 1em;
  }

  h5 {
    font-size: 0.875em;
  }

  h6 {
    font-size: 0.85em;
    color: #6a737d;
  }

  ol,
  ul {
    padding-left: 2em;
  }

  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  li {
    word-wrap: break-all;
  }

  li > p {
    margin-top: 16px;
  }

  li + li {
    margin-top: 0.25em;
  }

  dl {
    padding: 0;
  }

  dl dt {
    padding: 0;
    margin-top: 16px;
    font-size: 1em;
    font-style: italic;
    font-weight: 600;
  }

  dl dd {
    padding: 0 16px;
    margin-bottom: 16px;
  }

  table {
    display: block;
    width: 100%;
    overflow: auto;
  }

  table th {
    font-weight: 600;
  }

  table td,
  table th {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }

  table tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }

  table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }

  img {
    max-width: 100%;
    box-sizing: initial;
  }

  img[align='right'] {
    padding-left: 20px;
  }

  img[align='left'] {
    padding-right: 20px;
  }

  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }

  pre {
    word-wrap: normal;
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
  }

  pre > code {
    padding: 0;
    margin: 0;
    font-size: 100%;
    word-break: normal;
    white-space: pre;
    border: 0;
    display: inline;
    max-width: auto;
    overflow: visible;
    line-height: inherit;
    background-color: initial;
  }

  .task-list-item {
    list-style-type: none;
  }

  .task-list-item + .task-list-item {
    margin-top: 3px;
  }

  .task-list-item input {
    margin: 0 0.2em 0.25em -1.6em;
    vertical-align: middle;
  }
`
