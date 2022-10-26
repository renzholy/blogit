# BloGit

[![release](https://github.com/renzholy/blogit/actions/workflows/release.yml/badge.svg)](https://github.com/renzholy/blogit/actions/workflows/release.yml)

```text
Markdown -> GitHub -> Blogit -> Blog
```

## Features

- generate GitHub style blog website from markdown
- support comment by [utterances](https://utteranc.es/)
- deploy to GitHub Pages easily with [crazy-max/ghaction-github-pages](https://github.com/crazy-max/ghaction-github-pages)

## Usage

```yaml
- name: Build Static Files
  uses: renzholy/blogit@v0.1.7
  with:
    title: Found Pan Tiger
    index: /readme
    cname: fpt.ink
    header: About,/about
    footer: GitHub,https://github.com/renzholy;Twitter,http://twitter.com/rezholy;Jike,https://web.okjike.com/u/d25026f2-18ce-48aa-9ea7-c05a25446368
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Example

[workflows/publish.yml](https://github.com/renzholy/renzholy.github.io/blob/main/.github/workflows/publish.yml)

## Todos

- [ ] Dark mode
- [ ] Table of contents
- [ ] RSS
