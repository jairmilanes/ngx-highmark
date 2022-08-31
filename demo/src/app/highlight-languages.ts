import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import graphql from 'highlight.js/lib/languages/graphql';
import http from 'highlight.js/lib/languages/http';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import less from 'highlight.js/lib/languages/less';
import markdown from 'highlight.js/lib/languages/markdown';
import plaintext from 'highlight.js/lib/languages/plaintext';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import {LanguageMap} from "ngx-highmark";

export const languageMap: LanguageMap = {
  xml,
  javascript,
  typescript,
  bash,
  css,
  less,
  scss,
  markdown,
  diff,
  graphql,
  json,
  plaintext,
  shell,
  sql,
  yaml,
  http,
  dockerfile,
};
